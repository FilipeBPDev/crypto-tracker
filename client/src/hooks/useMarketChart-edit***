import { useEffect, useState } from "react";
import { fetchGlobalMarketData } from "../services/marketService";

export const useMarketChart = ({ user } = {}) => {
  const [chartData, setChartData] = useState([]);
  const [mode, setMode] = useState(user ? "user" : "global");
  void setMode; // evita warning

  useEffect(() => {
    const loadData = async () => {
      let data;

      if (user) {
        // ainda nao implementei o modo usuario (fetchUserWalletData)
        // por enquanto uso o global como fallback
        console.warn("modo usuario ainda nao implementado, usando global");
        data = await fetchGlobalMarketData("BTCUSDT");
      } else {
        // modo global puxando dados reais do backend
        data = await fetchGlobalMarketData("BTCUSDT");
      }

      setChartData(data);
    };

    loadData();

    // atualiza o grafico a cada 5 min (mvp)
    const interval = setInterval(loadData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  return { mode, chartData };
};

export default useMarketChart;
