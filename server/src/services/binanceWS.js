import WebSocket from "ws";
import dotenv from "dotenv";
import { insertRecord } from "../DAO/cryptoHistoryDAO.js";

dotenv.config();

// url do worker proxy (cloudflare)
const WORKER_URL = process.env.BINANCE_PROXY_WS;

// tempo de reconexão automática
const RECONNECT_DELAY = 5000;

// intervalo de salvamento do histórico (1 minuto)
const SAVE_INTERVAL = 60000;

// pares configurados no .env (fallback padrão)
const TOP_PAIRS = (process.env.BINANCE_TOP_PAIRS ||
  "btcusdt,ethusdt,bnbusdt,solusdt,xrpusdt,adausdt,dogeusdt,linkusdt,tonusdt,trxusdt"
)
  .split(",")
  .map((p) => p.trim().toLowerCase());

// controle do último horário salvo por moeda
const lastSaveMap = new Map();

export const startBinanceMArketStream = (onMessage) => {
  // inicia uma conexão individual por par
  TOP_PAIRS.forEach((symbol) => {
    connectSinglePair(symbol, onMessage);
  });
};

// gerencia uma única conexão websocket por par
function connectSinglePair(symbol, onMessage) {
  const wsURL = `${WORKER_URL}/${symbol}@ticker`;
  console.log(`Conectando ao Worker Proxy para ${symbol.toUpperCase()}: ${wsURL}`);

  const ws = new WebSocket(wsURL);

  // quando conectar
  ws.on("open", () => {
    console.log(`Stream conectado com sucesso para ${symbol.toUpperCase()}`);
  });

  // quando receber dados
  ws.on("message", async (raw) => {
    try {
      const ticker = JSON.parse(raw);

      if (!ticker || !ticker.s || !ticker.c) return;

      const sym = ticker.s;
      const price = parseFloat(ticker.c);
      const change = parseFloat(ticker.P);

      // envia dados atualizados para o front-end
      onMessage(ticker);

      // salva no banco a cada SAVE_INTERVAL
      const agora = Date.now();
      const ultimo = lastSaveMap.get(sym) || 0;

      if (agora - ultimo >= SAVE_INTERVAL) {
        await insertRecord(sym, price, change);
        lastSaveMap.set(sym, agora);
        console.log(`Histórico salvo: ${sym} | Preço: ${price}`);
      }
    } catch (err) {
      console.error(`Erro ao processar dados (${symbol}):`, err.message);
    }
  });

  // quando a conexão fecha
  ws.on("close", () => {
    console.warn(`Stream encerrado para ${symbol}. Tentando reconectar...`);
    setTimeout(() => connectSinglePair(symbol, onMessage), RECONNECT_DELAY);
  });

  // quando ocorrer erro
  ws.on("error", (err) => {
    console.error(`Erro no WebSocket (${symbol}):`, err.message);
    try {
      ws.close();
    } catch (_) {}
  });
}
