import { useEffect, useState } from "react";
import { useMarketSocket } from "../../hooks/useMarketSocket";
import DynamicCryptoIcon from "../../constants/cryptoIcons";

export default function LivePrice({ symbol }) {
  const { marketData } = useMarketSocket();

  // info completa da moeda direto do websocket
  const info = marketData[symbol];

  // preco atual
  const live = info?.price;
  // variacao 24h
  const change = info?.priceChangePercent;
  // nome real usado pelo DynamicCryptoIcon
  const name = info?.name; // exemplo: "bitcoin", "ethereum"

  const [display, setDisplay] = useState(null);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    if (!live) return;

    if (display && live > display) setFlash("flash-green");
    else if (display && live < display) setFlash("flash-red");

    setDisplay(live);

    const timer = setTimeout(() => setFlash(""), 250);
    return () => clearTimeout(timer);
  }, [live]);

  const changeColor =
    change > 0
      ? "text-green-400"
      : change < 0
      ? "text-red-400"
      : "text-gray-300";

  return (
    <div className="flex items-center gap-2">
      {/* icone real baseado no nome correto vindo do socket */}
      <DynamicCryptoIcon symbol={symbol} name={name} />

      {/* preco ao vivo */}
      <span
        className={`
          text-sm font-semibold px-2 py-[3px] rounded-md
          bg-white/10 border border-white/20
          transition-all duration-300 text-blue-300
          ${flash}
        `}
      >
        {display ? `$ ${display.toFixed(2)}` : "..."}
      </span>

      {/* variacao 24h */}
      {change !== undefined && (
        <span className={`text-xs font-semibold ${changeColor}`}>
          {change > 0 ? "+" : ""}
          {change}%
        </span>
      )}
    </div>
  );
}
