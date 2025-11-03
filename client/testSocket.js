import { io } from "socket.io-client";

// 1️⃣ URL do backend (confirme se está na mesma porta do seu index.js)
const SOCKET_URL = "http://localhost:5000";

// 2️⃣ Conexão com o servidor
const socket = io(SOCKET_URL, {
  transports: ["websocket"], // força uso de WS puro
  reconnectionAttempts: 3,
  timeout: 5000,
});

// 3️⃣ Eventos principais
socket.on("connect", () => {
  console.log("✅ Conectado ao servidor Socket.IO com ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Erro de conexão:", err.message || err);
});

socket.on("disconnect", (reason) => {
  console.warn("🔴 Desconectado. Motivo:", reason);
});

socket.on("reconnect_attempt", (attempt) => {
  console.log("🔁 Tentando reconectar... tentativa:", attempt);
});

// 4️⃣ Receber atualizações de mercado
socket.on("marketUpdate", (data) => {
  console.log("📈 Recebido update de mercado:");
  console.log(
    data.map((c) => `${c.s}: ${parseFloat(c.c).toFixed(2)}`).join(" | ")
  );
});

// 5️⃣ Timeout de debug
setTimeout(() => {
  if (!socket.connected) {
    console.error(
      "⚠️ Ainda não conectado após 5 segundos. Verifique se o backend está rodando na porta correta."
    );
  }
}, 5000);
