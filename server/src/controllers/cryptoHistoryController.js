const SYMBOL_REGEX = /^[a-z0-9-]{3,20}$/i;

/* ==========================================
   GET /history/:symbol
========================================== */
export const getHistoryBySymbolController = async (req, res) => {
  try {
    const symbol = req.params.symbol?.toLowerCase();

    if (!SYMBOL_REGEX.test(symbol)) {
      return res.status(400).json({ message: "símbolo inválido" });
    }

    const data = await getHistoryBySymbol(symbol, 30);

    const chartData = data.map((item) => ({
      time: new Date(item.timestamp).getTime(),
      price: item.price,
    }));

    res.json({
      symbol,
      count: chartData.length,
      chartData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "erro interno" });
  }
};
