import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import cryptoRoutes from "../src/routes/cryptosRoutes.js";
import portfolioRoutes from "../src/routes/portfolioRoutes.js";
import transactionRoutes from "../src/routes/transactionsRoutes.js";
import cryptoHistoryRoutes from "../src/routes/cryptoHistoryRoutes.js";
import authRoutes from "../src/routes/authRoutes.js";
import { startCryptoHistoryJob } from "./jobs/cryptoHistoryJob.js";

import { db } from "./config/db/connection.js";
import { startBinancePolling } from "./services/binancePolling.js";
import { startCleanHistoryService } from "./services/cleanHistoryService.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

/* ====================================
   Imports adicionais de segurança
==================================== */
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";

app.disable("x-powered-by");

/* ====================================
   Segurança com Helmet
==================================== */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/* ====================================
   Compressão global
==================================== */
app.use(compression());

/* ====================================
   Logs HTTP
==================================== */
app.use(morgan("dev"));

/* ====================================
   Configuração CORS global
==================================== */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

/* ====================================
   Rate limiting
==================================== */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Muitas requisições. Tente novamente mais tarde.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

/* ====================================
   Inicialização do servidor HTTP
==================================== */
const server = http.createServer(app);

/* ====================================
   Configuração do Socket.IO
==================================== */
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

/* ====================================
   Middlewares de processamento
==================================== */
app.use(express.json());

/* ====================================
   Rotas da API
==================================== */
app.use("/api", cryptoRoutes);
app.use("/api", portfolioRoutes);
app.use("/api", transactionRoutes);
app.use("/api", cryptoHistoryRoutes);
app.use("/api", authRoutes);

/* ====================================
   Teste inicial de conexão com MySQL
==================================== */
db.query("SELECT 1")
  .then(() => console.log("Conexão com MySQL funcionando"))
  .catch((err) => console.error("Erro ao conectar com MySQL:", err));

/* ====================================
   Configurações adicionais
==================================== */
const TOP_LIMIT = parseInt(process.env.TOP_LIMIT) || 12;
const THROTTLE_INTERVAL = parseInt(process.env.THROTTLE_INTERVAL) || 1000;

/* ====================================
   Cache local de mercado
==================================== */
let latestData = {};

/* ====================================
   Eventos do Socket.IO
==================================== */
io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  socket.emit("connected", { message: "Conectado ao servidor em tempo real" });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

/* ====================================
   Mapeamento dos nomes das moedas
==================================== */
const COIN_NAMES = {
  BITCOIN: "bitcoin",
  ETHEREUM: "ethereum",
  BINANCECOIN: "binancecoin",
  SOLANA: "solana",
  RIPPLE: "ripple",
  CARDANO: "cardano",
  DOGECOIN: "dogecoin",
  CHAINLINK: "chainlink",
  TONCOIN: "toncoin",
  TRON: "tron"
};

/* ====================================
   Início do Polling da Binance
==================================== */
startBinancePolling((symbol, price, percent, volume) => {
  latestData[symbol] = {
    symbol,
    price,
    percentChange: percent,
    volume,
  };
});



setInterval(() => {
  console.log("DEBUG latestData:", latestData);
}, 5000);
/* ====================================
   Emissão periódica dos dados ao frontend
==================================== */
setInterval(() => {
  const dataArray = Object.values(latestData);

  if (dataArray.length > 0) {
    const sorted = dataArray.sort((a, b) => b.volume - a.volume);

    const btc = sorted.find((coin) => coin.symbol.toLowerCase() === "btcusdt");
    const eth = sorted.find((coin) => coin.symbol.toLowerCase() === "ethusdt");

    const others = sorted.filter(
      (coin) =>
        coin.symbol.toLowerCase() !== "btcusdt" &&
        coin.symbol.toLowerCase() !== "ethusdt"
    );

    const topCoins = [btc, eth, ...others.slice(0, TOP_LIMIT - 2)].filter(Boolean);

    const dataObject = Object.fromEntries(
      topCoins.map((coin) => [
        coin.symbol.toUpperCase(),
        {
          name: COIN_NAMES[coin.symbol.toUpperCase()] || coin.symbol.toUpperCase(),
          price: coin.price,
          changePercent: coin.percentChange,
          volume: coin.volume,
        },
      ])
    );

    io.emit("marketUpdate", dataObject);
  }
}, THROTTLE_INTERVAL);

startCryptoHistoryJob();

/* ====================================
   Inicialização do servidor
==================================== */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  startCleanHistoryService();
});
