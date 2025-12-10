import WebSocket from "ws";
import dotenv from "dotenv";
import { insertRecord } from "../DAO/cryptoHistoryDAO.js";

dotenv.config();

// url base da binance
const BASE_URL = process.env.BINANCE_WS || "wss://stream.binance.com:9443";

// intervalo de reconexão
const RECONNECT_DELAY = 5000;

// intervalo para salvar histórico
const SAVE_INTERVAL = 60000;

// pares configurados no .env
const TOP_PAIRS = (process.env.BINANCE_TOP_PAIRS || "")
  .split(",")
  .map((p) => p.trim().toLowerCase());

// controle do histórico
const lastSave = new Map();

export function startBinanceMarketStream(onMessage) {
  const streams = TOP_PAIRS.map((s) => `${s}@ticker`).join("/");

  const wsURL = `${BASE_URL}/stream?streams=${streams}`;

  console.log("conectando diretamente na binance:", wsURL);

  let ws = new WebSocket(wsURL);

  ws.on("open", () => {
    console.log("conexão direta com a binance estabelecida");
  });

  ws.on("message", async (raw) => {
    try {
      const payload = JSON.parse(raw);
      if (!payload?.data) return;

      const d = payload.data;

      // envia ao servidor
      onMessage(d);

      // salva histórico a cada 1 minuto por moeda
      const now = Date.now();
      const previous = lastSave.get(d.s) || 0;

      if (now - previous >= SAVE_INTERVAL) {
        await insertRecord(d.s, parseFloat(d.c), parseFloat(d.P));
        lastSave.set(d.s, now);
        console.log(`histórico salvo: ${d.s}`);
      }
    } catch (err) {
      console.error("erro ao processar dados binance:", err.message);
    }
  });

  ws.on("error", (err) => {
    console.error("erro websocket binance:", err.message);
    try { ws.close(); } catch (_) {}
  });

  ws.on("close", () => {
    console.warn("binance desconectou, tentando reconectar...");
    setTimeout(() => startBinanceMarketStream(onMessage), RECONNECT_DELAY);
  });
}
