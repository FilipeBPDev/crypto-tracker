import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cryptoRoutes from "../src/routes/cryptosRoutes.js";
import portfolioRoutes from "../src/routes/portfolioRoutes.js";
import transactionRoutes from "../src/routes/transactionsRoutes.js";
import { db } from "./config/db/connection.js";
import { startBinanceMArketStream } from "./services/binanceWS.js";


dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  }
})

//middlewares
app.use(cors());
app.use(express.json());


//rotas de cryptos
app.use("/api", cryptoRoutes);

//rota de portfolio
app.use("/api", portfolioRoutes);

//rota transactions
app.use("/api", transactionRoutes);




db.query('SELECT 1')
  .then(() => console.log('Conexão com MySQL funcionando!'))
  .catch((err) => console.error('Erro ao conectar com MySQL:', err));

  //config de mercado
const TOP_LIMIT = parseInt(process.env.TOP_LIMIT) || 12;
const THROTTLE_INTERVAL = parseInt(process.env.THROTTLE_INTERVAL) || 1000;

//variavel de cahce local
let latestData = [];

io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  socket.emit("connected", { message: "Conectado ao servidor em tempo real" });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

const processMarketData = (data) => {
  try {
    //filtra apenas usdt
    const usdtPairs = data.filter(
      (coin => 
        coin.s.endsWith("USDT") &&
        !coin.s.startsWith("USDC") &&
        !coin.s.startsWith("BUSD") &&
        !coin.s.startsWith("TUSD") 
      )
    )

    //encontrar btc e eth
    const btc = usdtPairs.find((coin) => coin.s === "BTCUSDT");
    const eth = usdtPairs.find((coin) => coin.s === "ETHUSDT");

    //ordenar as demais por relevancia (volume * preço)
    const others = usdtPairs.filter(
      (coin) => coin.s !== "BTCUSDT" && coin.s !== "ETHUSDT").sort(
        (a, b) => parseFloat(b.q) * parseFloat(b.c) - parseFloat(a.q) * parseFloat(a.c));

    //monta ordem final
    const topCoins = [btc, eth, ...others.slice(0, TOP_LIMIT - 2)].filter(Boolean);
    

    latestData = topCoins;

  } catch (error) {
    console.error("Erro ao processar dados da Binance:", err);
  }
}

//inicia stream da binance
startBinanceMArketStream(processMarketData);

//envia dados a cada 1 segundo
setInterval(() => {
  if (latestData.length > 0) {
    io.emit("marketUpdate", latestData);
  }
}, THROTTLE_INTERVAL);




// portas
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

