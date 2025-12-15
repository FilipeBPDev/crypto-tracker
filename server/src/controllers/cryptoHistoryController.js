import { getHistoryBySymbol, insertRecord, deleteOldRecords } from "../DAO/cryptoHistoryDAO.js"; 

const SAVE_INTERVAL = 60000; //alterar em prod
const lastSaveTimestamps = new Map();
const SYMBOL_REGEX = /^[A-Z0-9]{3,12}$/;
const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 200;



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
        const symbolRegex = SYMBOL_REGEX;
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

export const getHistoryBySymbolController = async (req, res) => {
     try {
        const { symbol } = req.params;
        const rawLimit = parseInt(req.query.limit, 10);
        const { since, until, order } = req.query;

        const limit = (!Number.isInteger(rawLimit) || rawLimit <= 0) 
            ? DEFAULT_LIMIT 
            : Math.min(rawLimit, MAX_LIMIT);

        if (!symbol || !SYMBOL_REGEX.test(symbol.trim().toUpperCase())) { 
            return res.status(400).json({ 
                message: "símbolo inválido. use 3 a 12 caracteres alfanuméricos em maiúsculo.", 
            });
        }

        let sinceDate = null;
        let untilDate = null;

        if (since && !isNaN(Date.parse(since))) {
            sinceDate = new Date(since);
        }
        if (until && !isNaN(Date.parse(until))) {
            untilDate = new Date(until);
        }

        const orderValue = order && order.toUpperCase() === "ASC" ? "ASC" : "DESC";


        const symbolUpper = symbol.trim().toUpperCase();

        const data = await getHistoryBySymbol(symbolUpper, limit, sinceDate, untilDate, orderValue);
        
        data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        //retorna o horario
        const formatarHora = (isoString) => {
        return new Date(isoString).getTime(); // timestamp
        };

            //formata pro grafico
        const chartData = data.map(item => ({
          time: formatarHora(item.timestamp),
          price: item.price,
        }));

        return res.status(200).json({
          symbol: symbolUpper,
          count: chartData.length,
          limit,
          order: "ASC", // já que agora ordenamos cronologicamente
          since: sinceDate,
          until: untilDate,
          chartData,
        });
    } catch (error) {
        console.error("[Controller] getHistoryBySymbol error:", error);
        return res.status(500).json({ error: "Erro interno ao recuperar histórico." });
    }   

}

export const cleanOldRecordsController = async (req, res) => {
  try {
    const rawDays = parseInt(req.query.days, 10);
    const days = Number.isInteger(rawDays) && rawDays > 0 ? rawDays : 7;

    const result = await deleteOldRecords(days);

    return res.status(200).json({
      message: `limpeza concluída com sucesso.`,
      removed: result.affectedRows,
      days,
    });
  } catch (error) {
    console.error("[controller] erro ao limpar histórico:", error);
    return res.status(500).json({
      error: "erro interno ao limpar registros antigos.",
    });
  }
};