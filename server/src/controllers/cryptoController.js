//simlar dados
let cryptosCache = [
  { symbol: "BTCUSDT", name: "Bitcoin", price: 68000, change24h: 2.5 },
  { symbol: "ETHUSDT", name: "Ethereum", price: 3400, change24h: -1.2 },
  { symbol: "SOLUSDT", name: "Solana", price: 155, change24h: 5.1 },
];

//pegar todas as cryptos
export const getAllCryptos = (req, res) => {
  res.json(cryptosCache);
};

//selecionar cryptos por simbolo
export const getCryptoBySymbol = (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const crypto = cryptosCache.find(c => c.symbol === symbol);
    if(!crypto) {
        return res.status(404).json({ message: "Moeda não encontrada"});
    }
    res.json(crypto);
};
