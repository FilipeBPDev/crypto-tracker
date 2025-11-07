import { insertRecord } from "../DAO/cryptoHistoryDAO.js"; 

const SAVE_INTERVAL = 60000; //alterar em prod
const lastSaveTimestamps = new Map();



export const addCryptoController = async (req, res) => {
    try {
        const {symbol, price, change_24h} = req.body;
        //validação
        if(!symbol || !price || !change_24h) {
            return res.status(400).json({ message: "Simbolo ou Preço não informados"});
        }

        //normalizar
        const formatSymbol = symbol.trim().toUpperCase();
        const formatPrice = parseFloat(price);
        const formatChange = parseFloat(change_24h);

        //validar symbol
        const symbolRegex = /^[A-Z0-9]{3,12}$/;
        if (!symbolRegex.test(formatSymbol)) {
            return res.status(400).json({ message: "Symbol inválido. Deve conter entre 3 e 12 caracteres alfanuméricos em maiúsculo." });
        }

        //validar preço
        if (isNaN(formatPrice) || formatPrice <= 0) {
            return res.status(400).json({ message: "Preço inválido. Deve ser um número maior que zero." });
        }

        //validar change_24h
        if (isNaN(formatChange)) {
            return res.status(400).json({ message: "change_24h inválido. Deve ser um número." });
        }

        //valida porcentagem do change
        if (formatChange < -100 || formatChange > 100) {
            return res.status(400).json({ message: "change_24h fora da faixa lógica permitida (-100 a 100)." });
        }

        const now = Date.now()
        const lastSave = lastSaveTimestamps.get(formatSymbol) || 0;

        if (now - lastSave < SAVE_INTERVAL) {
            const secondsLeft = Math.ceil((SAVE_INTERVAL - (now - lastSave)) / 1000);

            return res.status(200).json({
                message: ` Histórico de ${formatSymbol} já salvo recentemente. Aguarde ${secondsLeft}s para novo registro.`,
            });
        }

        await insertRecord(formatSymbol, formatPrice, formatChange);
        lastSaveTimestamps.set(formatSymbol, now);

        res.status(201).json({ 
            message: `Histórico salvo com sucesso para ${formatSymbol}.`, 
            data: { symbol: formatSymbol, price, change_24h, timestamp: new Date().toISOString() },
        });

    } catch (error) {
        console.error("Erro ao inserir histórico:", error);
        res.status(500).json({ error: "Erro interno ao inserir histórico." });
    }

}

export const updateHistoryController = (req, res) => {

}

export const getHistoryBySSymbolController = (req, res) => {

}

export const cleanOldRecordsController = (req, res) => {

}