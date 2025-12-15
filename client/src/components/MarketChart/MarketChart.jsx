import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useState, useMemo } from "react";
import { useCryptoHistory } from "../../hooks/useCryptoHistory";
import useMarketChart from "../../hooks/useMarketChart";

/* ==========================================
   Componente principal do gráfico de mercado
========================================== */
export const MarketChart = ({
  chartData: externalData,
  user,
  initialSymbol = "bitcoin",
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);

  /* ==========================================
     Busca histórico da moeda (REST)
  ========================================== */
  const {
    chartData: historyData,
    loading,
    error,
  } = useCryptoHistory(selectedSymbol, 30);

  /* ==========================================
     Hook global (por enquanto usamos só o mode)
  ========================================== */
  useMarketChart({ user }); // mantido apenas pelo efeito colateral

  /* ==========================================
     Dados finais (memoizados)
  ========================================== */
  const finalData = useMemo(() => {
    return externalData || historyData || [];
  }, [externalData, historyData]);

  /* ==========================================
     Normalização dos dados
  ========================================== */
  const normalizedData = useMemo(() => {
    return finalData
      .map((item) => ({
        time: item.time,
        price: Number(item.price),
      }))
      .filter(
        (item) =>
          typeof item.time === "number" &&
          !Number.isNaN(item.price) &&
          item.price > 0
      );
  }, [finalData]);

  /* ==========================================
     Cálculo percentual
  ========================================== */
  const basePrice = normalizedData.length ? normalizedData[0].price : 0;

  const percentData = useMemo(() => {
    if (!basePrice) return [];
    return normalizedData.map((item) => ({
      ...item,
      percent: ((item.price - basePrice) / basePrice) * 100,
    }));
  }, [normalizedData, basePrice]);

  const filteredPercentData =
    percentData.length > 20
      ? percentData.filter((_, i) => i % 3 === 0)
      : percentData;

  /* ==========================================
     Moedas (CoinGecko IDs)
  ========================================== */
  const coins = [
    { id: "bitcoin", label: "BTC" },
    { id: "ethereum", label: "ETH" },
    { id: "binancecoin", label: "BNB" },
    { id: "solana", label: "SOL" },
    { id: "ripple", label: "XRP" },
  ];

  return (
    <div className="bg-[rgba(15,23,42,0.6)] border border-white/10 rounded-2xl p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-200">
          tendência de {selectedSymbol}
        </h2>

        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-gray-200"
        >
          {coins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-400 text-center">carregando...</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}
      {!loading && filteredPercentData.length < 2 && (
        <p className="text-gray-400 text-center">
          dados insuficientes para gerar o gráfico
        </p>
      )}

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={filteredPercentData}>
          <XAxis
            dataKey="time"
            tickFormatter={(v) => new Date(v).toLocaleTimeString()}
          />
          <YAxis tickFormatter={(v) => `${v.toFixed(2)}%`} />
          <Tooltip formatter={(v) => `${v.toFixed(2)}%`} />
          <Line
            type="monotone"
            dataKey="percent"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;
