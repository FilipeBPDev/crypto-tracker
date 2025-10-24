import express from "express";
import { getAllTransactions, getTransactionById ,addTransaction, deleteTransaction, getTransactionsBySymbol } from "../controllers/transactionsController.js";

const router = express.Router();

//todas trasnsações
router.get("/transactions", getAllTransactions);

//transação por id
router.get("/transactions/:id", getTransactionById);

//todas transações por symbol
router.get("/transactions/symbol/:symbol", getTransactionsBySymbol);

//adicionar nova transação
router.post("/transactions", addTransaction);

//deletar transação
router.delete("/transactions/:id", deleteTransaction);

export default router;