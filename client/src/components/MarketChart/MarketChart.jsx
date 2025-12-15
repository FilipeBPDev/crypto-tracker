import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useState, useMemo } from "react";
import { useCryptoHistory } from "../../hooks/useCryptoHistory-edit***";
import useMarketChart from "../../hooks/useMarketChart-edit***";
import LivePrice from "../LivePrice/LivePrice";
import FavoriteButton from "../FavoriteButton/FavoriteButton";

/* ==========================================
   Componente principal do gráfico de mercado
========================================== */
export const MarketChart = ({
  chartData: externalData,
  mode: externalMode,
  user,
  initialSymbol = "BTCUSDT",
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
  const { mode: globalMode } = useMarketChart({ user });

  /* ==========================================
     Definição final de dados e modo
  ========================================== */
  const finalData = externalData || historyData || [];
  const finalMode = externalMode || globalMode;

  const COLORS = ["#3B82F6", "#22C55E", "#EAB308", "#EC4899", "#8B5CF6"];

  /* ==========================================
     Normalização dos dados (CRÍTICO p/ REST)
     Garante que o gráfico receba sempre:
     { time, price }
  ========================================== */
  const normalizedData = useMemo(() => {
    return finalData
      .map((item) => ({
        time: item.time || item.timestamp || item.date || item.openTime,
        price: Number(item.price || item.close || item.value),
      }))
      .filter(
        (item) =>
          item.time !== undefined && !Number.isNaN(item.price) && item.price > 0
      );
  }, [finalData]);

  /* ==========================================
     Cálculo da variação percentual
  ========================================== */
  const basePrice = normalizedData.length ? normalizedData[0].price : 0;

  const percentData = useMemo(() => {
    if (basePrice === 0) return [];

    return normalizedData.map((item) => ({
      ...item,
      percent: ((item.price - basePrice) / basePrice) * 100,
    }));
  }, [normalizedData, basePrice]);

  /* ==========================================
     Filtro opcional para performance
  ========================================== */
  const filteredPercentData =
    percentData.length > 20
      ? percentData.filter((_, i) => i % 3 === 0)
      : percentData;

  /* ==========================================
     Moedas padrão
  ========================================== */
  const coins = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT"];

  return (
    <div
      className="bg-[rgba(15,23,42,0.6)]
                 border border-[rgba(255,255,255,0.08)]
                 rounded-2xl backdrop-blur-2xl
                 shadow-[0_4px_30px_rgba(0,0,0,0.25)]
                 p-4 transition-all duration-300
                 hover:shadow-[0_0_20px_rgba(88,101,242,0.1)]"
    >
      {/* ==========================================
         Header do card
      ========================================== */}
      <div
        className="
          flex flex-col gap-3 mb-4
          md:flex-row md:items-center md:justify-between
        "
      >
        <div className="flex flex-col md:flex-row md:items-center md:gap-3 text-center md:text-left">
          <h2 className="text-lg md:text-xl font-semibold text-gray-200 capitalize leading-tight">
            {finalMode === "user"
              ? "distribuição da carteira"
              : `tendência de ${selectedSymbol}`}
          </h2>

          {finalMode !== "user" && (
            <div className="flex items-center justify-center gap-2 mt-1 md:mt-0">
              <LivePrice symbol={selectedSymbol} />
              <FavoriteButton symbol={selectedSymbol} />
            </div>
          )}
        </div>

        {!externalData && finalMode !== "user" && (
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="
              bg-white/10 border border-white/20 rounded-md px-2 py-1 
              text-gray-200 outline-none focus:ring-2 focus:ring-blue-500
              w-full md:w-auto
            "
          >
            {coins.map((coin) => (
              <option key={coin} value={coin}>
                {coin}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ==========================================
         Estados de carregamento / erro
      ========================================== */}
      {loading && (
        <p className="text-gray-400 text-center">carregando dados...</p>
      )}

      {error && <p className="text-red-400 text-center">{error}</p>}

      {!loading && filteredPercentData.length < 2 && (
        <p className="text-gray-400 text-center">
          dados insuficientes para gerar o gráfico
        </p>
      )}

      {/* ==========================================
         Gráfico
      ========================================== */}
      <ResponsiveContainer width="100%" height={250}>
        {finalMode === "user" ? (
          <PieChart>
            <Pie
              data={finalData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              label
            >
              {finalData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <LineChart data={filteredPercentData}>
            <defs>
              <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              stroke="#999"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) =>
                typeof v === "number" ? new Date(v).toLocaleTimeString() : v
              }
            />

            <YAxis
              stroke="#999"
              width={53}
              tickFormatter={(v) => `${v.toFixed(2)}%`}
            />

            <Tooltip
              formatter={(v) => `${v.toFixed(2)}%`}
              labelStyle={{ color: "#cbd5e1" }}
              contentStyle={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Line
              type="monotone"
              dataKey="percent"
              stroke="url(#colorLine)"
              strokeWidth={3.3}
              dot={false}
              activeDot={{
                r: 6,
                stroke: "#60A5FA",
                strokeWidth: 2,
              }}
              isAnimationActive
              animationDuration={700}
              animationEasing="ease-in-out"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;
