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

export const MarketChart = ({
  chartData: externalData,
  mode: externalMode,
  user,
}) => {
  // hook padrão (global ou usuario)
  const { chartData, mode } = useMarketChart({ user });

  // se vier dados pela props (ex: pagina de historico), usa eles
  const finalData = externalData || chartData;
  const finalMode = externalMode || mode;

  const COLORS = ["#3B82F6", "#22C55E", "#EAB308", "#EC4899", "#8B5CF6"];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-200">
        {finalMode === "user"
          ? "distribuição da sua carteira"
          : "tendência do mercado"}
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        {finalMode === "user" ? (
          // grafico de pizza do usuario
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
              {finalData.map((entry, index) => (
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
          // grafico de linha global
          <LineChart data={finalData}>
            <defs>
              <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              stroke="#999"
              padding={{ left: -5, right: 0 }}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              stroke="#999"
              width={28}
              tick={{ fontSize: 12, dx: -5 }}
              axisLine={{ stroke: "#999" }}
              tickLine={{ stroke: "#666" }}
            />
            <Tooltip />

            <Line
              type="monotone"
              dataKey={finalMode === "user" ? "totalValue" : "price"}
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
