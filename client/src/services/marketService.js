import {api} from "./api.js";

export async function fetchGlobalMarketData(symbol = "BTCUSDT") {
  const response = await api.get(`/history/${symbol}?limit=30`);
  return response.data.chartData; 
}
