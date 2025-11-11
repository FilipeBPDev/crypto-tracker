import { Link, useParams } from "react-router-dom";
import { useCryptoHistory } from "../../hooks/useCryptoHistory.js";
import MarketChart from "../../components/MarketChart/MarketChart.jsx";

export const MarketHistory = () => {
  const { symbol } = useParams();
  const { chartData, loading, error } = useCryptoHistory(symbol, 30);

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0F172A] text-light overflow-hidden">
      {/* mesmo gradiente de fundo do Dashboard */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00121b] via-[#186085] to-[#052f45] opacity-95 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_50%_-10%,rgba(37,99,235,0.08),transparent_70%)] pointer-events-none" />

      {/*conteudo principal */}
      <main className="relative z-10 flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        {/* cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-100 tracking-wide drop-shadow-lg">
            Histórico de {symbol}
          </h1>

          <Link
            to="/"
            className="text-blue-400 text-sm hover:text-blue-300 transition"
          >
            ← Voltar
          </Link>
        </div>

        {/* card do grafico */}
        <div className="bg-white/5 border border-white/10 rounded-2xl shadow-lg p-4 md:p-6 backdrop-blur-sm">
          {loading ? (
            <p className="text-gray-400 text-center">
              Carregando histórico de {symbol}...
            </p>
          ) : error ? (
            <p className="text-red-400 text-center">{error}</p>
          ) : chartData?.length > 0 ? (
            <MarketChart chartData={chartData} mode="market" />
          ) : (
            <p className="text-gray-400 text-center">
              Nenhum dado histórico disponível para {symbol}.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default MarketHistory;
