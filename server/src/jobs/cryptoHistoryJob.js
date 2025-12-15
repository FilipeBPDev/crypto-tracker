import axios from "axios";
import { insertRecord } from "../DAO/cryptoHistoryDAO.js";

/* ==========================================
   Job de histórico (CoinGecko)
========================================== */

const COINS = [
  "bitcoin",
  "ethereum",
  "binancecoin",
  "solana",
  "ripple",
];

const SAVE_INTERVAL = 60 * 1000;

export const startCryptoHistoryJob = () => {
  console.log("[JOB] CoinGecko history job iniciado");

  setInterval(async () => {
    try {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price",
        {
          params: {
            ids: COINS.join(","),
            vs_currencies: "usd",
            include_24hr_change: "true",
          },
        }
      );

      for (const coin of COINS) {
        const price = data?.[coin]?.usd;
        const change = data?.[coin]?.usd_24h_change;

        if (!price || change === undefined) continue;

        await insertRecord(coin, price, change);
      }
    } catch (err) {
      console.error("[JOB] erro:", err.message);
    }
  }, SAVE_INTERVAL);
};
