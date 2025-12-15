import { useState, useEffect } from "react";
import { api } from "../services/api.js";

/* ==========================================
   Hook de histórico (CoinGecko IDs)
========================================== */
export const useCryptoHistory = (symbol, limit = 30) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!symbol) return;

        setLoading(true);
        setError(null);

        const res = await api.get(`history/${symbol}?limit=${limit}`);

        setChartData(res.data?.chartData || []);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar histórico");
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [symbol, limit]);

  return { chartData, loading, error };
};
