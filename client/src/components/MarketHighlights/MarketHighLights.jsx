import { useMarketSocket } from "../../hooks/useMarketSocket";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const MarketHighlights = () => {
  const { token } = useAuth();
  const { marketData, connected } = useMarketSocket(token);

  if (!connected)
    return (
      <section className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center text-gray-300">
        <p>conectando ao servidor...</p>
      </section>
    );

  if (!marketData || Object.keys(marketData).length === 0)
    return (
      <section className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center text-gray-300">
        <p>carregando dados de mercado...</p>
      </section>
    );

  /* prepara lista */
  const list = Object.keys(marketData).map((symbol) => ({
    symbol,
    ...marketData[symbol],
  }));

  const sorted = [...list].sort((a, b) => b.changePercent - a.changePercent);
  const topGainers = sorted.slice(0, 3);
  const topLosers = sorted.slice(-3).reverse();

  return (
    <section
      className="bg-[rgba(15,23,42,0.6)]
                 border border-[rgba(255,255,255,0.08)]
                 rounded-2xl backdrop-blur-2xl
                 shadow-[0_4px_30px_rgba(0,0,0,0.25)]
                 p-4 mt-4
                 max-h-none md:max-h-[220px]   /* mobile full / desktop fixo */
                 overflow-hidden"
    >
      {/* header */}
      <header className="border-b border-white/10 pb-1 mb-2">
        <h2 className="text-sm font-semibold text-white">
          destaques do mercado
        </h2>
        <p className="text-gray-400 text-[10px] tracking-wide">
          atualizando via websocket
        </p>
      </header>

      {/* grid ajustado para mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-auto md:h-[160px]">
        {/* top gainers */}
        <div className="overflow-y-auto pr-1">
          <div className="flex items-center gap-1 mb-1 text-[11px] font-semibold text-green-400">
            <ArrowUp size={10} /> top 3
          </div>

          <ul className="space-y-1">
            {topGainers.map((coin) => (
              <li
                key={coin.symbol}
                className="flex items-center justify-between
                           bg-white/5 p-2 rounded-lg border border-white/5 text-xs"
              >
                <span className="text-gray-100">
                  {coin.symbol.replace("USDT", "/USDT")}
                </span>
                <span className="text-green-400 font-semibold">
                  {coin.changePercent.toFixed(2)}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* top losers */}
        <div className="overflow-y-auto pr-1">
          <div className="flex items-center gap-1 mb-1 text-[11px] font-semibold text-red-400">
            <ArrowDown size={10} /> top 3
          </div>

          <ul className="space-y-1">
            {topLosers.map((coin) => (
              <li
                key={coin.symbol}
                className="flex items-center justify-between
                           bg-white/5 p-2 rounded-lg border border-white/5 text-xs"
              >
                <span className="text-gray-100">
                  {coin.symbol.replace("USDT", "/USDT")}
                </span>
                <span className="text-red-400 font-semibold">
                  {coin.changePercent.toFixed(2)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default MarketHighlights;
