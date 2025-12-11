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
   Busca REST única na CoinGecko
========================================== */
async function fetchAllTickers() {
  try {
    const ids = TOP_PAIRS.join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;

    const res = await fetch(url);

    if (!res.ok) {
      console.log("ERRO COINGECKO (MULTI):", res.status, res.statusText);
      return null;
    }

    return await res.json();

  } catch (err) {
    console.error("Erro CoinGecko:", err);
    return null;
  }
}

/* ==========================================
   Polling principal
========================================== */
export function startBinancePolling(onUpdate) {
  console.log("PRODUÇÃO: Iniciando REST Polling (CoinGecko - MultiFetch)...");

  setInterval(async () => {
    const tickers = await fetchAllTickers();
    if (!tickers) return;

    for (const id of TOP_PAIRS) {
      const info = tickers[id];
      if (!info) continue;

      const price = info.usd ?? 0;
      const percent = info.usd_24h_change ?? 0;
      const volume = info.usd_24h_vol ?? 0;

      // Atualiza latestData no servidor
      if (onUpdate) {
        onUpdate(id.toUpperCase(), price, percent, volume);
      }

      // Salva histórico 1x por minuto
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
