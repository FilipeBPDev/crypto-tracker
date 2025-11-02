import { useState, useEffect } from "react";
import { api } from "../services/api.js";

export const useCryptos = () => {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCryptos = async () => {
        try {
            const response = await api.get("market");
            setCryptos(response.data);
        } catch (err) {
            setError("Erro ao carregar dados do mercado");
            console.error("❌ Erro ao buscar cryptos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCryptos();
    }, []);
    return { cryptos, loading, error};
};

