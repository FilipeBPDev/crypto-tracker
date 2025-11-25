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

import { useState } from "react";
import { useCryptoHistory } from "../../hooks/useCryptoHistory";
import useMarketChart from "../../hooks/useMarketChart";
import LivePrice from "../LivePrice/LivePrice";
import FavoriteButton from "../FavoriteButton/FavoriteButton";

export const MarketChart = ({
  chartData: externalData,
  mode: externalMode,
  user,
  initialSymbol = "BTCUSDT",
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);

  // busca historico da moeda quando troca a moeda
  const {
    chartData: historyData,
    loading,
    error,
  } = useCryptoHistory(selectedSymbol, 30);

  // hook global (so usamos o mode)
  const { mode: globalMode } = useMarketChart({ user });

  // escolha final dos dados
  const finalData = externalData || historyData || [];
  const finalMode = externalMode || globalMode;

  const COLORS = ["#3B82F6", "#22C55E", "#EAB308", "#EC4899", "#8B5CF6"];

  // preco base
  const basePrice = finalData.length > 0 ? finalData[0].price : 0;

  // variacao %
  const percentData = finalData.map((item) => ({
    ...item,
    percent: basePrice > 0 ? ((item.price - basePrice) / basePrice) * 100 : 0,
  }));

  // filtro pq o grafico fica mais leve
  const filteredPercentData = percentData.filter((_, i) => i % 3 === 0);

  // moedas padroes
  const coins = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT"];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      {/* header do card */}
      <div className="flex items-center justify-between mb-3">
        {/* titulo + preco + favorito */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-200 capitalize">
            {finalMode === "user"
              ? "distribuicao da carteira"
              : `tendencia de ${selectedSymbol}`}
          </h2>

          {/* preco em tempo real */}
          {finalMode !== "user" && <LivePrice symbol={selectedSymbol} />}

          {/* botao favorito */}
          {finalMode !== "user" && <FavoriteButton symbol={selectedSymbol} />}
        </div>

        {/* seletor de moeda */}
        {!externalData && finalMode !== "user" && (
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-md px-2 py-1 
                       text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {coins.map((coin) => (
              <option key={coin} value={coin}>
                {coin}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* loading / erro */}
      {loading && (
        <p className="text-gray-400 text-center">carregando dados...</p>
      )}
      {error && <p className="text-red-400 text-center">{error}</p>}

      {/* grafico */}
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
              {finalData.map((entry, i) => (
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

            <XAxis dataKey="time" stroke="#999" tick={{ fontSize: 12 }} />
            <YAxis
              stroke="#999"
              width={53}
              tickFormatter={(v) => `${v.toFixed(2)}%`}
            />

            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                color: "#fff",
              }}
              labelStyle={{ color: "#cbd5e1" }}
              formatter={(v) => `${v.toFixed(2)}%`}
            />

            <Line
              type="monotone"
              dataKey="percent"
              stroke="url(#colorLine)"
              strokeWidth={3.3}
              dot={false}
              activeDot={{ r: 6, stroke: "#60A5FA", strokeWidth: 2 }}
              isAnimationActive={true}
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
