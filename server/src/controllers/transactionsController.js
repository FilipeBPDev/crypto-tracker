let transactions = [
  {
    id: "tx001",
    symbol: "BTCUSDT",
    name: "Bitcoin",
    type: "buy",
    amount: 0.5,
    price: 68000,
    total: 34000,
  },
  {
    id: "tx002",
    symbol: "ETHUSDT",
    name: "Ethereum",
    type: "buy",
    amount: 2,
    price: 3400,
    total: 6800,
  },
  {
    id: "tx003",
    symbol: "BTCUSDT",
    name: "Bitcoin",
    type: "sell",
    amount: 0.2,
    price: 70000,
    total: 14000,
  },
];


let portfolio = [
  { symbol: "BTCUSDT", name: "Bitcoin", priceBuy: 68000, change24h: 2.5, amount: 0.7},
  { symbol: "ETHUSDT", name: "Ethereum", priceBuy: 3400, change24h: -1.2, amount: 2},
  { symbol: "SOLUSDT", name: "Solana", priceBuy: 155, change24h: 5.1, amount: 10},
];


//todas transações
export const getAllTransactions = (req, res) => {
    res.json(transactions);
}

//transação por id
export const getTransactionById = (req, res) => {
    const { id } = req.params;
    const transaction = transactions.find(t => t.id === id);

    if(!transaction) {
        return res.status(400).json({ message: "Transação não encontrada"});
    }
    res.json(transaction);
}

//todas transações por symbol
export const getTransactionsBySymbol = (req, res) =>{
    const { symbol } = req.params;
    const transactionBtSymbol = transactions.find(t => t.symbol === symbol);

    if(!transactionBtSymbol) {
        return res.status(400).json({ message: "Nenhuma transação encontrada para esse símbolo"});
    }
    res.json(transactionBtSymbol);
}


//adicionar nova transação
export const addTransaction =(req, res) => {
    const { id, symbol, name, type, amount, price } = req.body
    const total = amount * price;

    if(!id || !symbol || !name || !type || !amount || !price) {
        return res.status(400).json({ message: "Dados incompletos"});
    }

    if(type !== "buy" && type !== "sell") {
        return res.status(400).json({ message: "Tipo de transação inválido"});
    }
   

    const crypto = portfolio.find(p => p.symbol === symbol);

    if(type === "buy") {
        if(crypto) {
            crypto.amount += amount;
        } else {
            portfolio.push({ symbol, name, priceBuy: price, change24h: 0, amount });
        }
    } else {
        if(!crypto || (crypto.amount || 0) < amount) {
            return res.status(400).json({ message: "Saldo insuficiente para venda"});
        }
        crypto.amount -= amount;
    }

    const newTransaction = {id, symbol, name, type, amount, price, total};

    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
}

//deletar transação
export const deleteTransaction = (req, res) => {
    const { id } = req.params;
    const index = transactions.findIndex(t => t.id === id);
    
    if(index === -1) {
        return res.status(400).json({ message: "Transação não encontrada"});
    }
    
    const deletedTransaction = transactions.splice(index, 1)[0];

     res.status(200).json({
    message: "Transação deletada com sucesso",
    deleted: deletedTransaction
  });
}

