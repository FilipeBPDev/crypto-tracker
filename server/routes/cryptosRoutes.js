import express from "express";
import { getAllCryptos, getCryptoBySymbol } from "../src/controllers/cryptoController.js";

const router = express.Router();

router.get("/market", getAllCryptos);

router.get("/market/:symbol", getCryptoBySymbol);

export default router;