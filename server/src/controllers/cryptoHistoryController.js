import {
  getHistoryBySymbol,
  insertRecord,
  deleteOldRecords,
} from "../DAO/cryptoHistoryDAO.js";

/* ==========================================
   Configurações gerais
========================================== */
const SAVE_INTERVAL = 60_000; // 1 minuto
const lastSaveTimestamps = new Map();

// CoinGecko IDs (bitcoin, ethereum, solana...)
const SYMBOL_REGEX = /^[a-z0-9-]{3,32}$/;

const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 200;

/* ==========================================
   Adiciona registro manual de histórico
   (endpoint opcional / debug / admin)
========================================== */
export const addCryptoController = async (req, res) => {
  try {
    const { symbol, price, change_24h } = req.body;

    /* ==========================================
       Validação básica
    ========================================== */
    if (!symbol || price === undefined || change_24h === undefined) {
      return res.status(400).json({
        message: "símbolo, preço ou change_24h não informados",
      });
    }

    /* ==========================================
       Normalização
    ========================================== */
    const formatSymbol = symbol.trim().toLowerCase();
    const formatPrice = parseFloat(price);
    const formatChange = parseFloat(change_24h);

    /* ==========================================
       Validações
    ========================================== */
    if (!SYMBOL_REGEX.test(formatSymbol)) {
      return res.status(400).json({
        message:
          "symbol inválido. use o id do CoinGecko (ex: bitcoin, ethereum)",
      });
    }

    if (isNaN(formatPrice) || formatPrice <= 0) {
      return res.status(400).json({
        message: "preço inválido",
      });
    }

    if (isNaN(formatChange) || formatChange < -100 || formatChange > 100) {
      return res.status(400).json({
        message: "change_24h fora da faixa permitida (-100 a 100)",
      });
    }

    /* ==========================================
       Controle de intervalo por símbolo
    ========================================== */
    const now = Date.now();
    const lastSave = lastSaveTimestamps.get(formatSymbol) || 0;

    if (now - lastSave < SAVE_INTERVAL) {
      const secondsLeft = Math.ceil(
        (SAVE_INTERVAL - (now - lastSave)) / 1000
      );

      return res.status(200).json({
        message: `histórico de ${formatSymbol} já salvo recentemente. aguarde ${secondsLeft}s`,
      });
    }

    /* ==========================================
       Inserção no banco
    ========================================== */
    await insertRecord(formatSymbol, formatPrice, formatChange);
    lastSaveTimestamps.set(formatSymbol, now);

    return res.status(201).json({
      message: `histórico salvo com sucesso para ${formatSymbol}`,
      data: {
        symbol: formatSymbol,
        price: formatPrice,
        change_24h: formatChange,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[Controller] addCrypto error:", error);
    return res.status(500).json({
      error: "erro interno ao inserir histórico",
    });
  }
};

/* ==========================================
   Atualização futura (placeholder)
========================================== */
export const updateHistoryController = (_req, res) => {
  return res.status(501).json({
    message: "endpoint ainda não implementado",
  });
};

/* ==========================================
   Busca histórico por símbolo
   (usado pelo MarketChart)
========================================== */
export const getHistoryBySymbolController = async (req, res) => {
  try {
    const { symbol } = req.params;
    const rawLimit = parseInt(req.query.limit, 10);
    const { since, until, order } = req.query;

    /* ==========================================
       Validação do símbolo
    ========================================== */
    if (!symbol || !SYMBOL_REGEX.test(symbol.trim().toLowerCase())) {
      return res.status(400).json({
        message:
          "símbolo inválido. use o id do CoinGecko (ex: bitcoin)",
      });
    }

    /* ==========================================
       Normalização
    ========================================== */
    const symbolNormalized = symbol.trim().toLowerCase();

    const limit =
      !Number.isInteger(rawLimit) || rawLimit <= 0
        ? DEFAULT_LIMIT
        : Math.min(rawLimit, MAX_LIMIT);

    const orderValue =
      order && order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    let sinceDate = null;
    let untilDate = null;

    if (since && !isNaN(Date.parse(since))) {
      sinceDate = new Date(since);
    }

    if (until && !isNaN(Date.parse(until))) {
      untilDate = new Date(until);
    }

    /* ==========================================
       Consulta no DAO
    ========================================== */
    const data = await getHistoryBySymbol(
      symbolNormalized,
      limit,
      sinceDate,
      untilDate,
      orderValue
    );

    /* ==========================================
       Ordena cronologicamente (gráfico)
    ========================================== */
    data.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    /* ==========================================
       Formatação para o frontend
    ========================================== */
    const chartData = data.map((item) => ({
      time: new Date(item.timestamp).getTime(), // timestamp em ms
      price: item.price,
    }));

    return res.status(200).json({
      symbol: symbolNormalized,
      count: chartData.length,
      limit,
      order: "ASC",
      since: sinceDate,
      until: untilDate,
      chartData,
    });
  } catch (error) {
    console.error(
      "[Controller] getHistoryBySymbol error:",
      error
    );
    return res.status(500).json({
      error: "erro interno ao recuperar histórico",
    });
  }
};

/* ==========================================
   Limpeza de registros antigos
========================================== */
export const cleanOldRecordsController = async (req, res) => {
  try {
    const rawDays = parseInt(req.query.days, 10);
    const days =
      Number.isInteger(rawDays) && rawDays > 0 ? rawDays : 7;

    const result = await deleteOldRecords(days);

    return res.status(200).json({
      message: "limpeza concluída com sucesso",
      removed: result.affectedRows,
      days,
    });
  } catch (error) {
    console.error(
      "[Controller] cleanOldRecords error:",
      error
    );
    return res.status(500).json({
      error: "erro interno ao limpar registros antigos",
    });
  }
};
