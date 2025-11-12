import express from "express";
import { loginUserController, registerUserController } from "../controllers/authController.js";

const router = express.Router();

// rota para criar usuário
router.post("/auth/register", registerUserController);

router.post("/auth/login", loginUserController);


export default router;