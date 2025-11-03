import { io } from "socket.io-client";
//url backend
const SOCKET_URL = "http://localhost:5000";

// conexão com o servidor
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 3,
  timeout: 5000,
});

//eventos principais
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

// receber atualizações de mercado
socket.on("marketUpdate", (data) => {
  if (!data || !Array.isArray(data)) return;
  console.log("📈 Recebido update de mercado:");
  const formatted = data.map(
    (c) => `${c.symbol}: $${parseFloat(c.price).toFixed(2)} (${c.percentChange.toFixed(2)}%)`
  ).join(" | ");
  console.log(formatted);
});

// 5️⃣ Timeout de debug
setTimeout(() => {
  if (!socket.connected) {
    console.error(
      "⚠️ Ainda não conectado após 5 segundos. Verifique se o backend está rodando na porta correta."
    );
  }
}, 5000);
