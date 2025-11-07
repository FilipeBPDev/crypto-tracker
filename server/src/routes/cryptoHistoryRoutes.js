import express from "express";
import { addCryptoController } from "../controllers/cryptoHistoryController.js";


const router = express.Router();

router.post("/history/add", addCryptoController);


export default router;
