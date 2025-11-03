import WebSocket from "ws";
import dotenv from "dotenv";

dotenv.config();

const BINANCE_WS_URL = process.env.BINANCE_WS_URL;
const RECONNECT_DELAY = 5000;

export const startBinanceMArketStream = (onMessage) => {
    let ws;

    const connect = () => {
        ws = new WebSocket(`${BINANCE_WS_URL}/!ticker@arr`);

        ws.on("open", () => console.log("Conectado a Binance:", BINANCE_WS_URL));

        ws.on("message", (data) => {
            try {
                const parsed = JSON.parse(data);
                 onMessage(parsed);
            } catch (err) {
                console.error("Erro ao parsear mensagem:", err);
            }
        });

        //mantém a conexão
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