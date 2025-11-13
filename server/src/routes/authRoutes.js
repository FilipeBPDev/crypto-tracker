import express from "express";
import { loginUserController, registerUserController } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// rota para criar usuário
router.post("/auth/register", registerUserController);

router.post("/auth/login", loginUserController);

router.get("/auth/profile", verifyToken, (req, res) => {
  res.json({
    message: "Acesso autorizado!",
    user: req.user,
  });
});


export default router;