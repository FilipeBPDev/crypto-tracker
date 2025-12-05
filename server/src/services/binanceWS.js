import WebSocket from "ws";
import dotenv from "dotenv";
import { insertRecord } from "../DAO/cryptoHistoryDAO.js";

dotenv.config();

const WORKER_URL = process.env.BINANCE_PROXY_WS;
const RECONNECT_DELAY = 5000;
const SAVE_INTERVAL = 60000; // 1 min

// pares do .env
const TOP_PAIRS = (process.env.BINANCE_TOP_PAIRS ||
  "btcusdt,ethusdt,bnbusdt,solusdt,xrpusdt,adausdt,dogeusdt,linkusdt,tonusdt,trxusdt"
)
  .split(",")
  .map((p) => p.trim().toLowerCase());

// controla o salvamento histórico
const lastSaveMap = new Map();

export const startBinanceMArketStream = (onMessage) => {
  let ws;

  const connect = () => {
    const streamName = TOP_PAIRS.map((pair) => `${pair}@ticker`);
    const fullURL = `${WORKER_URL}/stream?streams=${streamName.join("/")}`;

    console.log("🌐 Conectando ao Worker Proxy:", fullURL);

    ws = new WebSocket(fullURL);

    ws.on("open", () => {
      console.log("✅ Market stream conectado via Worker Proxy");
    });

    ws.on("message", async (raw) => {
      try {
        const parsed = JSON.parse(raw);

        if (!parsed.data || !parsed.data.s) return;

        const data = parsed.data;
        const symbol = data.s;
        const price = parseFloat(data.c);
        const change = parseFloat(data.P);

        // ======== Atualiza UI/Front ========
        onMessage(data);

        // ======== Salva histórico 1x por minuto ========
        const now = Date.now();
        const last = lastSaveMap.get(symbol) || 0;

        if (now - last >= SAVE_INTERVAL) {
          await insertRecord(symbol, price, change);
          lastSaveMap.set(symbol, now);
          console.log(`💾 Histórico salvo: ${symbol} | ${price}`);
        }

      } catch (err) {
        console.error("Erro MarketStream:", err.message);
      }
    });

    ws.on("close", () => {
      console.warn("⚠️ Worker fechou Market Stream. Reconnecting...");
      setTimeout(connect, RECONNECT_DELAY);
    });

    ws.on("error", (err) => {
      console.error("❌ Erro no Market Stream:", err.message);
      try { ws.close(); } catch {}
    });
  };

  connect();
};
