import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// rota para criar usuário
router.post("/register", register);

// rota para login
router.post("/login", login);

export default router;