import WebSocket from "ws";
import dotenv from "dotenv";

dotenv.config();

const WORKER_URL = process.env.BINANCE_PROXY_WS; 
const RECONNECT_DELAY = 5000;

const TOP_PAIRS = (process.env.BINANCE_TOP_PAIRS ||
  "btcusdt,ethusdt,bnbusdt,solusdt,xrpusdt,adausdt,dogeusdt,linkusdt,tonusdt,trxusdt"
)
  .split(",")
  .map((p) => p.trim().toLowerCase());

export const startBinanceMArketStream = (onMessage) => {
  let ws;

  const connect = () => {
    const streamName = TOP_PAIRS.map((pair) => `${pair}@ticker`);
    const fullURL = `${WORKER_URL}/stream?streams=${streamName.join("/")}`;

    console.log("🌐 Conectando ao Worker Proxy:", fullURL);

    ws = new WebSocket(fullURL);

    ws.on("open", () => {
      console.log("✅ Market stream conectado via Worker Proxy");
    });

    ws.on("message", (data) => {
      try {
        const parsed = JSON.parse(data);

        if (parsed.data && parsed.data.s && parsed.data.c) {
          onMessage(parsed.data);
        }
      } catch (err) {
        console.error("Erro no Worker Market Stream:", err.message);
      }
    });

    ws.on("close", () => {
      console.warn("⚠️ Worker fechou Market Stream. Reconnecting...");
      setTimeout(connect, RECONNECT_DELAY);
    });

    ws.on("error", (err) => {
      console.error("❌ Erro Worker Market Stream:", err.message);
      try { ws.close(); } catch {}
    });
  };

  connect();
};
