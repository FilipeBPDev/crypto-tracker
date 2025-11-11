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
import useMarketChart from "../../hooks/useMarketChart";

export const MarketChart = (user) => {
  const { chartData, mode } = useMarketChart(user);

  // pleta de cores para o grafico de pizza
  const COLORS = ["#3B82F6", "#22C55E", "#EAB308", "#EC4899", "#8B5CF6"];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-200">
        {mode === "user"
          ? "Distribuição da sua carteira"
          : "Tendência do mercado"}
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        {mode === "user" ? (
          // grafico de Pizza (modo usuário)
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          // grafico de Linha (modo global)
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              stroke="#999"
              padding={{ left: -5, right: 0 }} // 🔹 valor negativo puxa ainda mais pra esquerda
              tick={{ fontSize: 12 }}
            />

            <YAxis
              stroke="#999"
              width={28} // 🔹 reduzido ainda mais (de 35 → 28)
              tick={{ fontSize: 12, dx: -5 }} // 🔹 desloca os números um pouco pra esquerda
              axisLine={{ stroke: "#999" }}
              tickLine={{ stroke: "#666" }}
            />
            <Tooltip />

            <Line
              type="monotone"
              dataKey={mode === "user" ? "totalValue" : "avgChange"}
              stroke="url(#colorLine)"
              strokeWidth={3.5}
              dot={false}
              fillOpacity={1}
              activeDot={{ r: 6, stroke: "#60A5FA", strokeWidth: 2 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;
