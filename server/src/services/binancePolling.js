import dotenv from "dotenv";
import { insertRecord } from "../DAO/cryptoHistoryDAO.js";

dotenv.config();

/* ==========================================
   Intervalos de operação
========================================== */
const SAVE_INTERVAL = 60000; // salva histórico a cada 1 minuto
const FETCH_INTERVAL = 5000; // atualiza preços a cada 5 segundos

/* ==========================================
   Pares configurados no .env
========================================== */
const TOP_PAIRS = (process.env.BINANCE_TOP_PAIRS || "")
  .split(",")
  .map((p) => p.trim().toLowerCase());

const lastSave = new Map();

console.log("TOP_PAIRS:", TOP_PAIRS);

/* ==========================================
   Busca REST na CoinGecko
========================================== */
async function fetchTicker(id) {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;

    const res = await fetch(url);

    if (!res.ok) {
      console.log("ERRO COINGECKO:", id, res.status, res.statusText);
      return null;
    }

    const data = await res.json();

    return {
      price: data[id]?.usd ?? null,
      percent: data[id]?.usd_24h_change ?? 0,
      volume: data[id]?.usd_24h_vol ?? 0
    };

  } catch (err) {
    console.error("Erro CoinGecko:", err);
    return null;
  }
}

/* ==========================================
   Polling principal
========================================== */
export function startBinancePolling(onUpdate) {
  console.log("PRODUÇÃO: Iniciando REST Polling (CoinGecko)...");

  setInterval(async () => {
    for (const id of TOP_PAIRS) {
      const ticker = await fetchTicker(id);
      if (!ticker) continue;

      const { price, percent, volume } = ticker;

      // atualiza latestData no servidor
      if (onUpdate) {
        onUpdate(id.toUpperCase(), price, percent, volume);
      }

      // salva histórico a cada 1 minuto por moeda
      const now = Date.now();
      const previous = lastSave.get(id) || 0;

      if (now - previous >= SAVE_INTERVAL) {
        await insertRecord(id.toUpperCase(), price, percent);
        lastSave.set(id, now);

        console.log(`Histórico salvo (REST): ${id.toUpperCase()}`);
      }
    }
  }, FETCH_INTERVAL);
}
