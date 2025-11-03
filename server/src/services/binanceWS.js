import WebSocket from "ws";
import dotenv from "dotenv";

dotenv.config();

const BINANCE_WS_URL = process.env.BINANCE_WS_URL;
const RECONNECT_DELAY = 5000;

//pares de coins
const TOP_PAIRS = (process.env.BINANCE_TOP_PAIRS ||
    "btcusdt,ethusdt,bnbusdt,solusdt,xrpusdt,adausdt,dogeusdt,linkusdt,tonusdt,trxusdt" ).split(",").map(
        (pair) => pair.trim().toLowerCase());


export const startBinanceMArketStream = (onMessage) => {
    let ws;

    const connect = () => {
        const streamName = TOP_PAIRS.map((pair) => `${pair}@ticker`);
        const streamURL = `${BINANCE_WS_URL}/stream?streams=${streamName.join("/")}`;

        ws = new WebSocket(streamURL);

        ws.on("open", () => console.log("Conectado a Binance:", streamURL));

        ws.on("message", (data) => {
            try {
                const parsed = JSON.parse(data);
                if (parsed.data && parsed.data.s && parsed.data.c) {
                  onMessage(parsed.data); // só envia conteudo relevante
                }
            } catch (err) {
                console.error("Erro ao parsear mensagem:", err);
            }
        });

        //mantem a conexão
        ws.on("ping", (payload) => {
            ws.pong(payload); 
        });

        //conexão fechada
        ws.on("close", () => {
            console.warn("⚠️ Conexão Binance fechada. Tentando reconectar...");
            setTimeout(connect, RECONNECT_DELAY);
        });
        
        //erro de conexão
        ws.on("error", (err) => {
            console.error("Erro Binance WS:", err);
            ws.close();
        });   
    };
    connect();
}