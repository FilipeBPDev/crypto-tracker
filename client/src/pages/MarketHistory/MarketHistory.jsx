import { useState } from "react";
import { Link } from "react-router-dom";
import { useCryptoHistory } from "../../hooks/useCryptoHistory";
import MarketChart from "../../components/MarketChart/MarketChart";

export default function MarketHistory() {
  // moeda padrão para iniciar o gráfico
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");

  // busca histórico baseado apenas na moeda selecionada
  const { chartData, loading, error } = useCryptoHistory(selectedSymbol, 30);

  // lista de moedas que você pode expandir depois
  const coins = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT", "ADAUSDT"];

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0F172A] text-light overflow-x-hidden">
      {/* fundo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00121b] via-[#186085] to-[#052f45] opacity-95 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_50%_-10%,rgba(37,99,235,0.08),transparent_70%)] pointer-events-none" />

      <main className="relative z-10 flex-1 w-full px-4 sm:px-6 md:px-8 py-6 max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-100 tracking-wide drop-shadow-lg">
            Histórico de {selectedSymbol}
          </h1>

          <Link
            to="/"
            className="text-blue-400 text-sm sm:text-base hover:text-blue-300 transition"
          >
            ← Voltar
          </Link>
        </div>

        {/* SELETOR DE MOEDAS */}
        <div className="mb-6 flex gap-3 items-center">
          <p className="text-gray-300 font-medium">Moeda:</p>

          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {coins.map((coin) => (
              <option key={coin} value={coin}>
                {coin}
              </option>
            ))}
          </select>
        </div>

        {/* card do gráfico */}
        <div className="bg-white/5 border border-white/10 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 backdrop-blur-sm w-full">
          {loading ? (
            <p className="text-gray-400 text-center">Carregando dados...</p>
          ) : error ? (
            <p className="text-red-400 text-center">{error}</p>
          ) : chartData?.length > 0 ? (
            <div className="relative w-full">
              <div className="aspect-[16/8] sm:aspect-[16/7] md:aspect-[16/6]">
                <MarketChart chartData={chartData} mode="global" />
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center">
              Nenhum dado disponível para {selectedSymbol}.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
