import express from "express";
import { getPortfolio, addToPortfolio, deleteFromPortfolio, updatePortfolio } from "../src/controllers/portfolioController.js"

const router = express.Router();

//todo o portfolio
router.get("/portfolio", getPortfolio);

//adicionar nova crypto    
router.post("/portfolio", addToPortfolio);

//deletar crypto do portfolio
router.delete("/portfolio/:symbol", deleteFromPortfolio);

//atualizar crypto do portfolio
router.put("/portfolio/:symbol", updatePortfolio);


export default router;