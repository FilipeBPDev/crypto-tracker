import WebSocket from "ws";
import dotenv from "dotenv";
import { insertRecord } from "../DAO/cryptoHistoryDAO.js";

dotenv.config();

// url do worker proxy (cloudflare)
const WORKER_URL = process.env.BINANCE_PROXY_WS;

// tempo de reconexão automática
const RECONNECT_DELAY = 5000;

// intervalo de salvamento do histórico (1 minuto)
const SAVE_INTERVAL = 60000;

// pares configurados no .env (fallback padrão)
const TOP_PAIRS = (process.env.BINANCE_TOP_PAIRS ||
  "btcusdt,ethusdt,bnbusdt,solusdt,xrpusdt,adausdt,dogeusdt,linkusdt,tonusdt,trxusdt"
)
  .split(",")
  .map((p) => p.trim().toLowerCase());

// controle do último horário salvo por moeda
const lastSaveMap = new Map();

export const startBinanceMArketStream = (onMessage) => {
  // monta stream único com todos os pares
  const streams = TOP_PAIRS.map((p) => `${p}@ticker`).join("/");

  // monta url final do worker
  const wsURL = `${WORKER_URL}/stream?streams=${streams}`;

  console.log("Conectando ao Worker Proxy:", wsURL);

  let ws = new WebSocket(wsURL);

  // quando conectar
  ws.on("open", () => {
    console.log("Conexão única com Worker Proxy estabelecida com sucesso");
  });

  // quando receber dados
  ws.on("message", async (raw) => {
    try {
      const payload = JSON.parse(raw);
      if (!payload || !payload.data) return;

      const data = payload.data;

      const symbol = data.s;
      const price = parseFloat(data.c);
      const change = parseFloat(data.P);

      // envia dados atualizados para o front-end
      onMessage(data);

      // salva histórico apenas 1x por minuto
      const agora = Date.now();
      const ultimo = lastSaveMap.get(symbol) || 0;

      if (agora - ultimo >= SAVE_INTERVAL) {
        await insertRecord(symbol, price, change);
        lastSaveMap.set(symbol, agora);
        console.log(`Histórico salvo: ${symbol} | ${price}`);
      }

    } catch (err) {
      console.error("Erro ao processar dados:", err.message);
    }
  });

  // quando fechar
  ws.on("close", () => {
    console.warn("Conexão encerrada. Tentando reconectar...");
    setTimeout(() => startBinanceMArketStream(onMessage), RECONNECT_DELAY);
  });

  // quando der erro
  ws.on("error", (err) => {
    console.error("Erro no WebSocket:", err.message);
    try { ws.close(); } catch (_) {}
  });
};
