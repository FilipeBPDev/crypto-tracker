import { useState } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import MarketChart from "../../components/MarketChart/MarketChart";

/* ==========================================
   Página de histórico de mercado
   Visualização detalhada por moeda
========================================== */
export default function MarketHistory() {
  /* ==========================================
     Moeda selecionada (CoinGecko ID)
  ========================================== */
  const [selectedSymbol, setSelectedSymbol] = useState("bitcoin");

  /* ==========================================
     Moedas disponíveis
     (padronizadas com CoinGecko)
  ========================================== */
  const coins = [
    { id: "bitcoin", label: "BTC" },
    { id: "ethereum", label: "ETH" },
    { id: "binancecoin", label: "BNB" },
    { id: "solana", label: "SOL" },
    { id: "ripple", label: "XRP" },
  ];

  return (
    <div className="relative flex flex-col md:flex-row min-h-screen bg-[#0F172A] text-light overflow-hidden">
      {/* fundo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00121b] via-[#186085] to-[#052f45] opacity-95 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_50%_-10%,rgba(37,99,235,0.08),transparent_70%)] pointer-events-none" />

      {/* sidebar fixa */}
      <Sidebar />

      {/* área principal */}
      <main className="relative flex-1 p-4 md:p-6 z-10">
        <Topbar />

        {/* cabeçalho da página */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 mb-6 gap-3">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-100 tracking-wide">
            Histórico de {selectedSymbol.toUpperCase()}
          </h1>

          <Link
            to="/"
            className="text-blue-400 text-sm hover:text-blue-300 transition"
          >
            ← Voltar
          </Link>
        </div>

        {/* seletor de moedas */}
        <div className="mb-6 flex gap-3 items-center">
          <p className="text-gray-300 font-medium">Moeda:</p>

          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.label}
              </option>
            ))}
          </select>
        </div>

        {/* gráfico */}
        <div className="max-w-5xl">
          <MarketChart initialSymbol={selectedSymbol} user={null} />
        </div>
      </main>
    </div>
  );
}
