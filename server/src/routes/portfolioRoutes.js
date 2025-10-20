import express from "express";
import { getPortfolio, addToPortfolio, deleteFromPortfolio, updatePortfolio, getPortfolioValue } from "../controllers/portfolioController.js"

const router = express.Router();

//todo o portfolio
router.get("/portfolio", getPortfolio);

//adicionar nova crypto    
router.post("/portfolio", addToPortfolio);

//deletar crypto do portfolio
router.delete("/portfolio/:symbol", deleteFromPortfolio);

//atualizar crypto do portfolio
router.put("/portfolio/:symbol", updatePortfolio);

//valor total do portfolio
router.get("/portfolio/value", getPortfolioValue);

export default router;