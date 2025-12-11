import dotenv from "dotenv";
import { insertRecord } from "../DAO/cryptoHistoryDAO.js";

dotenv.config();

const SAVE_INTERVAL = 60000; // salva a cada 1 minuto
const FETCH_INTERVAL = 5000; // atualiza preços a cada 5s

const TOP_PAIRS = (process.env.BINANCE_TOP_PAIRS || "")
  .split(",")
  .map((p) => p.trim().toUpperCase());

const lastSave = new Map();

console.log("TOP_PAIRS:", TOP_PAIRS);

// busca REST na Binance
async function fetchTicker(symbol) {
  try {
    const res = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`Erro REST Binance (${symbol}):`, err.message);
    return null;
  }
}

// polling principal
export function startBinancePolling(onUpdate) {
  console.log("PRODUÇÃO: Iniciando REST Polling da Binance...");

  setInterval(async () => {
    for (const symbol of TOP_PAIRS) {
      const data = await fetchTicker(symbol);
      if (!data) continue;

      const price = parseFloat(data.lastPrice);
      const percent = parseFloat(data.priceChangePercent);
      const volume = parseFloat(data.volume || data.quoteVolume || 0);

      // atualiza latestData no servidor
      if (onUpdate) {
        onUpdate(symbol, price, percent, volume);
      }

      //salva histórico se passou 1 minuto
      const now = Date.now();
      const previous = lastSave.get(symbol) || 0;

      if (now - previous >= SAVE_INTERVAL) {
        await insertRecord(symbol, price, percent);
        lastSave.set(symbol, now);

        console.log(`💾 Histórico salvo (REST): ${symbol}`);
      }
    }
  }, FETCH_INTERVAL);
}
