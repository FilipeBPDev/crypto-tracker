import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useMarketSocket = () => {
    const [marketData, setMarketData] = useState({});
    const [connected, setConnected] = useState(false);

    
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_SOCKET_URL, {
          transports: ["websocket", "polling"],
        });

        socket.on("connect", () => {
          //console.log("Conectado ao servidor WebSocket:", socket.id);
          setConnected(true);
        });

        socket.on("marketUpdate", (data) => {
          setMarketData(data);
        });

        socket.on("disconnect", () => {
          //console.log("Desconectado do servidor WebSocket");
          setConnected(false);
        });

    return () => socket.disconnect();
    }, []);

    return { marketData, connected };

}