import axios from "axios";
import { insertRecord } from "../DAO/cryptoHistoryDAO.js";

/* ==========================================
   Job de gravação de histórico de criptos
   Responsável por popular a tabela crypto_history
   automaticamente (sem depender do frontend)
========================================== */

// símbolos monitorados
const SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT"];

// intervalo de salvamento (1 minuto)
const SAVE_INTERVAL = 60 * 1000;

/* ==========================================
   Inicia o job de histórico
========================================== */
export const startCryptoHistoryJob = () => {
  console.log("[JOB] Crypto history job iniciado");

  setInterval(async () => {
    try {
      for (const symbol of SYMBOLS) {
        /* ==========================================
           Busca dados atuais da Binance
        ========================================== */
        const { data } = await axios.get(
          "https://api.binance.com/api/v3/ticker/24hr",
          { params: { symbol } }
        );

        const price = parseFloat(data.lastPrice);
        const change24h = parseFloat(data.priceChangePercent);

        if (isNaN(price) || isNaN(change24h)) {
          console.warn(
            `[JOB] dados inválidos ignorados para ${symbol}`
          );
          continue;
        }

        /* ==========================================
           Insere no histórico
        ========================================== */
        await insertRecord(symbol, price, change24h);

        console.log(
          `[JOB] histórico salvo | ${symbol} | ${price}`
        );
      }
    } catch (error) {
      console.error(
        "[JOB] erro ao salvar histórico:",
        error.message
      );
    }
  }, SAVE_INTERVAL);
};
