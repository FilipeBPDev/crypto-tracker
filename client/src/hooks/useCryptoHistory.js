import { useState, useEffect } from "react";
import { api } from "../services/api.js";

export const useCryptoHistory = (symbol, limit = 1440) => {
  const [chartData, setChartData] = useState([]); // deve ser array, não objeto
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!symbol) return;
        setLoading(true);
        const response = await api.get(`history/${symbol}?limit=${limit}`);
        setChartData(response.data.chartData);
      } catch (err) {
        setError("Erro ao carregar histórico da moeda");
        console.error("❌ Erro ao buscar histórico:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory(); 
  }, [symbol, limit]);
  return { chartData, loading, error };
};
