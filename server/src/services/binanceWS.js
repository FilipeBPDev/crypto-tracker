import axios from "axios";
import dotenv from "dotenv";
import { insertRecord } from "../DAO/cryptoHistoryDAO.js";

dotenv.config();

// pares configurados no .env (fallback padrão)
const TOP_PAIRS = (process.env.BINANCE_TOP_PAIRS ||
  "btcusdt,ethusdt,bnbusdt,solusdt,xrpusdt,adausdt,dogeusdt,linkusdt,tonusdt,trxusdt"
)
  .split(",")
  .map((p) => p.trim().toUpperCase());

// intervalo do polling (3s)
const POLL_INTERVAL = 3000;

// intervalo para salvar histórico (1 minuto)
const SAVE_INTERVAL = 60000;

// controle do último horário salvo por moeda
const lastSaveMap = new Map();

// inicia polling de mercado
export const startBinanceMArketStream = (onMessage) => {
  console.log("Iniciando polling da Binance (REST cada 3s)...");

  const fetchMarketData = async () => {
    try {
      // busca dados 24hr de cada par
      const responses = await Promise.all(
        TOP_PAIRS.map((symbol) =>
          axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
        )
      );

      for (const resp of responses) {
        const data = resp.data;

        const symbol = data.symbol;
        const price = parseFloat(data.lastPrice);
        const change = parseFloat(data.priceChangePercent);

        // envia esses dados para o backend processar
        onMessage({
          s: symbol,
          c: price,
          P: change,
          q: parseFloat(data.volume),
        });

        // salvamento no histórico
        const agora = Date.now();
        const ultimo = lastSaveMap.get(symbol) || 0;

        if (agora - ultimo >= SAVE_INTERVAL) {
          await insertRecord(symbol, price, change);
          lastSaveMap.set(symbol, agora);
          console.log(`Histórico salvo: ${symbol} | ${price}`);
        }
      }
    } catch (err) {
      console.error("Erro ao buscar dados da Binance:", err.message);
    }
  };

  // executa uma vez imediatamente
  fetchMarketData();

  // executa a cada 3 segundos
  setInterval(fetchMarketData, POLL_INTERVAL);
};
