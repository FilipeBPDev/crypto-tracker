import express from "express";
import { loginUserController, registerUserController } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { registerValidation, loginValidation } from "../validators/authValidator.js";
import { validationHandler } from "../middleware/validationHandler.js";


const router = express.Router();

// rota para criar usuário
router.post("/auth/register", registerValidation, validationHandler, registerUserController);

//rota para login
router.post("/auth/login", loginValidation, validationHandler, loginUserController);

router.get("/auth/profile", verifyToken, (req, res) => {
  res.json({
    message: "Acesso autorizado!",
    user: req.user,
  });
});


export default router;