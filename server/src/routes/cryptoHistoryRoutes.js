import express from "express";
import { addCryptoController, cleanOldRecordsController, getHistoryBySymbolController } from "../controllers/cryptoHistoryController.js";


const router = express.Router();

router.post("/history/add", addCryptoController);

router.get("/history/:symbol", getHistoryBySymbolController);

router.delete("/history/clean", cleanOldRecordsController);


export default router;
