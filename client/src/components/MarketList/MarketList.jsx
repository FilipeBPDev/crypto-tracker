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
        {cryptos.map((item) => (
          <li
            key={item.symbol}
            className="py-3 flex items-center justify-between hover:text-primary transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              {/* ícone vindo da Ledger ou fallback */}
              {CRYPTO_ICONS[item.symbol] || CRYPTO_ICONS.DEFAULT}

              <span className="text-dark font-medium">{item.name}</span>
            </div>

            {/* preço formatado */}
            <span className="text-sm text-gray-400">
              $
              {Number(item.price).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default MarketList;
