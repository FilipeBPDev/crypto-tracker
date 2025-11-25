import { useMarketSocket } from "../../hooks/useMarketSocket";
import DynamicCryptoIcon from "../../constants/cryptoIcons";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const MarketList = () => {
  const { token } = useAuth();
  const { marketData, connected } = useMarketSocket(token);

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
      className="bg-[rgba(15,23,42,0.6)] 
           border border-[rgba(255,255,255,0.08)] 
           rounded-2xl backdrop-blur-2xl
           shadow-[0_4px_30px_rgba(0,0,0,0.25)]
           w-[340px] h-[330px] flex flex-col overflow-hidden
           hover:shadow-[0_0_20px_rgba(88,101,242,0.1)] transition-all duration-300"
    >
      {/* cabeçalho fixo */}
      <div className="sticky top-0 z-10 backdrop-blur-lg border-b border-white/20 p-4">
        <h2 className="text-lg font-semibold text-white">
          Mercado em tempo real
        </h2>
      </div>

      {/* lista com scroll interno */}
      <ul className="flex-1 overflow-y-auto p-4 space-y-3 transition-opacity duration-500">
        {Object.entries(marketData).map(([symbol, info]) => {
          const changePercent = info?.changePercent ?? 0;
          const price = parseFloat(info.price).toLocaleString("en-US", {
            minimumFractionDigits: 2,
          });

          return (
            <li
              key={symbol}
              className="flex items-center justify-between text-sm 
                         border-b border-white/5 pb-2 px-2 
                         hover:bg-white/5 hover:scale-[1.01] 
                         transition-all duration-200 rounded-lg"
            >
              {/* ícone e símbolo */}
              <div className="flex items-center gap-2 w-[40%]">
                <DynamicCryptoIcon symbol={symbol} name={info.name} />
                <span className="text-gray-100 font-medium tracking-wide">
                  {symbol.replace("USDT", "/USDT")}
                </span>
              </div>

              {/* preço */}
              <span className="text-gray-400 w-[30%] text-right">${price}</span>

              {/* variação */}
              <div
                className={`flex items-center justify-end gap-1 w-[20%] font-semibold ${
                  changePercent >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {changePercent >= 0 ? (
                  <ArrowUp
                    size={9}
                    strokeWidth={2.5}
                    className="translate-y-[1px]"
                  />
                ) : (
                  <ArrowDown
                    size={16}
                    strokeWidth={2.5}
                    className="translate-y-[1px]"
                  />
                )}
                <span>{changePercent.toFixed(2)}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default MarketList;
