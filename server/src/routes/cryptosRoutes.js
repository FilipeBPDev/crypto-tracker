import express from "express";
import { deleteCryptoController, getAllCryptosControl, getCryptoBySymbolControl, instertCryptoControl, saveOrUpdateCryptoController, updateChangeController, updatePriceController } from "../controllers/cryptoController.js";

const router = express.Router();


router.get("/market", getAllCryptosControl);

router.get("/market/:symbol", getCryptoBySymbolControl);

router.post("/market/add", instertCryptoControl);

router.put("/market/update", updatePriceController);

router.put("/market/update24h", updateChangeController);

router.post("/market/save", saveOrUpdateCryptoController);

router.delete("/market/delete/:symbol", deleteCryptoController);



export default router;