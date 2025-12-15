import { useState, useEffect } from "react";
import { api } from "../services/api.js";

/* ==========================================
   Hook de histórico de preços (REST)
   Responsável APENAS por buscar dados
========================================== */
export const useCryptoHistory = (symbol, limit = 1440) => {
  const [chartData, setChartData] = useState([]); // sempre array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!symbol) return;

        setLoading(true);
        setError(null);

        const response = await api.get(
          `history/${symbol}?limit=${limit}`
        );

        /* ==========================================
           Normalização do response
           (protege contra mudanças no backend)
        ========================================== */
        const data =
          response.data?.chartData ||
          response.data?.data ||
          response.data ||
          [];

        if (!Array.isArray(data)) {
          throw new Error("Formato de histórico inválido");
        }

        setChartData(data);
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
        setError("Erro ao carregar histórico da moeda");
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [symbol, limit]);

  return { chartData, loading, error };
};
