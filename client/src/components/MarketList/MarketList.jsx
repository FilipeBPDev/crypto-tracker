import { useMarketSocket } from "../../hooks/useMarketSocket";
import DynamicCryptoIcon from "../../constants/cryptoIcons";

export const MarketList = () => {
  const { marketData, connected } = useMarketSocket();

  if (!connected)
    return (
      <aside className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center text-gray-300">
        <p>Conectando ao servidor...</p>
      </aside>
    );

  if (!marketData || Object.keys(marketData).length === 0)
    return (
      <aside className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center text-gray-300">
        <p>Carregando dados de mercado...</p>
      </aside>
    );

  return (
    <aside
      className="bg-white/10 border border-white/20 rounded-2xl shadow-lg 
                 w-[340px] h-[330px] flex flex-col overflow-hidden backdrop-blur-xl"
    >
      {/* Cabeçalho fixo */}
      <div className="sticky top-0 z-10 backdrop-blur-lg border-b border-white/20 p-4">
        <h2 className="text-gray-100 text-lg font-semibold">
          Mercado em tempo real
        </h2>
      </div>

      {/* Lista com scroll interno */}
      <ul
        className="flex-1 overflow-y-auto p-4 space-y-3 
                   scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent 
                   hover:scrollbar-thumb-white/30"
      >
        {Object.entries(marketData).map(([symbol, info]) => {
          const changePercent = info?.changePercent ?? 0;
          const price = parseFloat(info.price).toLocaleString("en-US", {
            minimumFractionDigits: 2,
          });

          return (
            <li
              key={symbol}
              className="flex items-center justify-between text-sm border-b border-white/10 pb-2"
            >
              {/* Ícone e símbolo */}
              <div className="flex items-center gap-2">
                <DynamicCryptoIcon symbol={symbol} name={info.name} />
                <span className="text-gray-200 font-medium">{symbol}</span>
              </div>

              {/* Preço */}
              <span className="text-gray-400">${price}</span>

              {/* Variação */}
              <span
                className={`${
                  changePercent >= 0 ? "text-green-400" : "text-red-400"
                } font-semibold`}
              >
                {changePercent.toFixed(2)}%
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default MarketList;
