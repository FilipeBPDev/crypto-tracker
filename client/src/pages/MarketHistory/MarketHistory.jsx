import { Link, useParams } from "react-router-dom";
import { useCryptoHistory } from "../../hooks/useCryptoHistory.js";
import MarketChart from "../../components/MarketChart/MarketChart.jsx";

export const MarketHistory = () => {
  const { symbol } = useParams();
  const { chartData, loading, error } = useCryptoHistory(symbol, 30);

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0F172A] text-light overflow-x-hidden">
      {/* mesmo gradiente de fundo do Dashboard */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00121b] via-[#186085] to-[#052f45] opacity-95 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_50%_-10%,rgba(37,99,235,0.08),transparent_70%)] pointer-events-none" />

      {/* conteúdo principal */}
      <main className="relative z-10 flex-1 w-full px-4 sm:px-6 md:px-8 py-6 max-w-5xl mx-auto">
        {/* cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-0 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-100 tracking-wide drop-shadow-lg">
            Histórico de {symbol}
          </h1>

          <Link
            to="/"
            className="text-blue-400 text-sm sm:text-base hover:text-blue-300 transition"
          >
            ← Voltar
          </Link>
        </div>

        {/* card do gráfico */}
        <div className="bg-white/5 border border-white/10 rounded-2xl shadow-lg px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 backdrop-blur-sm w-full">
          {loading ? (
            <p className="text-gray-400 text-center text-sm sm:text-base">
              Carregando histórico de {symbol}...
            </p>
          ) : error ? (
            <p className="text-red-400 text-center text-sm sm:text-base">
              {error}
            </p>
          ) : chartData?.length > 0 ? (
            <div className="relative w-full">
              {/* o container do gráfico agora controla a altura por proporção */}
              <div className="aspect-[16/9] sm:aspect-[16/8] md:aspect-[16/7]">
                <MarketChart chartData={chartData} mode="market" />
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center text-sm sm:text-base">
              Nenhum dado histórico disponível para {symbol}.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default MarketHistory;
