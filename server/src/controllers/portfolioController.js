
let portfolio = [
  { symbol: "BTCUSDT", name: "Bitcoin", priceBuy: 68000, change24h: 2.5 },
  { symbol: "ETHUSDT", name: "Ethereum", priceBuy: 3400, change24h: -1.2 },
  { symbol: "SOLUSDT", name: "Solana", priceBuy: 155, change24h: 5.1 },
];

//todo o portfolio
export const getPortfolio = (req, res) => {
  res.json(portfolio);
};

//adicionar nova crypto ao portfolio
export const addToPortfolio = (req, res) => {
    const { symbol, name, priceBuy } = req.body;
   if(!symbol || !name || !priceBuy) {
        return res.status(400).json({ message: "Dados incompletos"});
   }
   const newCrypto = {symbol, name, priceBuy};
   portfolio.push(newCrypto);
   res.status(201).json(newCrypto);
}

//deletar crypto do portfolio
export const deleteFromPortfolio = (req, res) => {
    const { symbol } = req.params;
    const index = portfolio.findIndex(c => c.symbol === symbol);
    if(index === -1) {
        return res.status(404).json({ message: "Você não tem essa moeda no seu portfólio"});
    }
    portfolio.splice(index, 1);
    res.status(200).json( { message: "Crypto removida do portfólio com sucesso"} );
}

//atualizar crypto 
export const updatePortfolio = (req, res) => {
    const { symbol } = req.params;
    const { priceBuy } = req.body;
    const crypto = portfolio.find(c => c.symbol === symbol);
    if(!crypto) {
        return res.status(404).json({ message: "Você não tem essa moeda no seu portfólio"});
    }
    if(priceBuy) crypto.priceBuy = priceBuy;
    res.status(200).json(crypto);
}



