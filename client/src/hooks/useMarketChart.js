import { useEffect, useState } from "react";
import { fetchGlobalMarketData, fetchUserWalletData } from "../services/marketService";


export const useMarketChart = ({user}) => {
    const [chartData, setChartData] = useState([]);
    const [mode, setMode] = useState(user? "user" : "global");
    void setMode;

    useEffect(() => {
        const loadData = async () => {
            let data;
            if(user) {
                data = await fetchUserWalletData(user.id); //busca moedas do usuario
            } else {
                data = await fetchGlobalMarketData(); //top 5 moedas globais
            }
            setChartData(data);
        }
        loadData();

        // atualiza a cada 5 min
        const interval = setInterval(loadData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user]);
    return {mode, chartData}

}

export default useMarketChart;
