/*
import WebSocket from "ws";
import dotenv from "dotenv";
import { insertRecord } from "../DAO/cryptoHistoryDAO.js";

dotenv.config();

const WORKER_URL = process.env.BINANCE_PROXY_WS;
const SAVE_INTERVAL = 60000;

const SYMBOLS = process.env.BINANCE_TOP_PAIRS
  ? process.env.BINANCE_TOP_PAIRS.split(",").map((s) => s.trim().toLowerCase())
  : [];

const lastSaveTimestamps = new Map();

export const startBinanceSync = () => {
  if (SYMBOLS.length === 0) {
    console.error("Nenhum par configurado em BINANCE_TOP_PAIRS!");
    return;
  }

  SYMBOLS.forEach((symbol) => {
    const connect = () => {
      const wsURL = `${WORKER_URL}/${symbol}@ticker`;
      const ws = new WebSocket(wsURL);

      ws.on("open", () => {
        console.log(`🔄 Sync conectado via Worker: ${symbol.toUpperCase()}`);
      });

      ws.on("message", async (msg) => {
        try {
          const data = JSON.parse(msg);
          const price = parseFloat(data.c);
          const change_24h = parseFloat(data.P);

          const now = Date.now();
          const last = lastSaveTimestamps.get(symbol) || 0;

          if (now - last >= SAVE_INTERVAL) {
            await insertRecord(symbol.toUpperCase(), price, change_24h);
            lastSaveTimestamps.set(symbol, now);
            console.log(`💾 Sync salvo: ${symbol.toUpperCase()} | $${price} (${change_24h}%)`);
          }
        } catch (err) {
          console.error(`Erro sync (${symbol}):`, err.message);
        }
      });

      ws.on("close", () => {
        console.warn(`Sync ${symbol} desconectado. Reconnect...`);
        setTimeout(connect, 5000);
      });

      ws.on("error", (err) => {
        console.error(`Erro Worker Sync (${symbol}):`, err.message);
        try { ws.close(); } catch {}
      });
    };

    connect();
  });
};
 */
