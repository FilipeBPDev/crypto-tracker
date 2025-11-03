import { useCryptos } from "../../hooks/useCryptos";
import { CRYPTO_ICONS } from "../../constants/cryptoIcons";

export const MarketList = () => {
  const { cryptos, loading, error } = useCryptos();

  if (loading)
    return (
      <aside className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg py-6 px-6 w-full md:w-1/3 flex items-center justify-center">
        <p className="text-gray-300 text-sm animate-pulse">
          Carregando mercado...
        </p>
      </aside>
    );

  if (error)
    return (
      <aside className="bg-red-500/10 border border-red-500/30 rounded-2xl py-6 px-6 w-full md:w-1/3 flex items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
      </aside>
    );

  return (
    <aside className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg py-4 px-6 w-full md:w-1/3 hover:bg-white/15 transition-all duration-300">
      <h3 className="font-semibold text-dark mb-2">Market</h3>
      <ul className="divide-y divide-gray-200">
        {cryptos.map((item) => {
          const price = Number(item.price);
          const change = Number(item.change24h); // ex: campo vindo da Binance ou calculado no backend
          const isPositive = change >= 0;

          return (
            <li
              key={item.symbol}
              className="py-3 px-2 flex items-center justify-between rounded-lg hover:bg-white/5 transition-all duration-300"
            >
              {/* Esquerda: ícone e nome */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  {CRYPTO_ICONS[item.symbol] || CRYPTO_ICONS.DEFAULT}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-sm text-gray-100">
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-400">{item.symbol}</span>
                </div>
              </div>

              {/* Direita: preço e variação */}
              <div className="flex flex-col items-end">
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isPositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  $
                  {price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span
                  className={`text-xs ${
                    isPositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default MarketList;
