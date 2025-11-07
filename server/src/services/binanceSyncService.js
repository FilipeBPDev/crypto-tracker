import WebSocket from "ws";
import dotenv from "dotenv";
import { insertRecord } from "../DAO/cryptoHistoryDAO.js";

dotenv.config(); // garante que as variáveis do .env sejam carregadas

const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws";
const SAVE_INTERVAL = 60000; // 1 min

// Lê e converte a variável do .env em array
const SYMBOLS = process.env.BINANCE_TOP_PAIRS
  ? process.env.BINANCE_TOP_PAIRS.split(",").map((s) => s.trim().toLowerCase())
  : [];

const lastSaveTimestamps = new Map();

export const startBinanceSync = () => {
  if (SYMBOLS.length === 0) {
    console.error("Nenhum par configurado em BINANCE_TOP_PAIRS no .env!");
    return;
  }

  SYMBOLS.forEach((symbol) => {
    const ws = new WebSocket(`${BINANCE_WS_URL}/${symbol}@ticker`);

    ws.on("open", () => {
      console.log(`Conectado à Binance: ${symbol.toUpperCase()}`);
    });

    ws.on("message", async (msg) => {
      try {
        const data = JSON.parse(msg);
        const price = parseFloat(data.c);
        const change_24h = parseFloat(data.P);

        const now = Date.now();
        const lastSave = lastSaveTimestamps.get(symbol) || 0;

        if (now - lastSave >= SAVE_INTERVAL) {
          await insertRecord(symbol.toUpperCase(), price, change_24h);
          lastSaveTimestamps.set(symbol, now);
          console.log(`Salvo: ${symbol.toUpperCase()} | $${price} (${change_24h}%)`);
        }
      } catch (err) {
        console.error(`Erro ao processar ${symbol}:`, err);
      }
    });

    ws.on("close", () => {
      console.warn(`${symbol} desconectado. Tentando reconectar...`);
      setTimeout(() => startBinanceSync(), 5000);
    });

    ws.on("error", (err) => {
      console.error(` Erro no WebSocket de ${symbol}:`, err.message);
    });
  });
};
