import express from "express";
import { getAllCryptosControl, getCryptoBySymbolControl, instertCryptoControl, updatePriceController } from "../controllers/cryptoController.js";

const router = express.Router();

router.get("/market", getAllCryptosControl);

router.get("/market/:symbol", getCryptoBySymbolControl);

router.post("/market/add", instertCryptoControl);

router.put("/market/update", updatePriceController);

export default router;