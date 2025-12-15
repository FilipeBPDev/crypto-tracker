/* ==========================================
   Hook de controle do modo do gráfico
   - global: gráfico de mercado (linha)
   - user: gráfico de carteira (pizza)
========================================== */
export const useMarketChart = ({ user } = {}) => {
  /* ==========================================
     Definição do modo atual
  ========================================== */
  const mode = user ? "user" : "global";

  return { mode };
};

export default useMarketChart;
