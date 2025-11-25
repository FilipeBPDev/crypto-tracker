import express from "express";

import {
  registerUserController,
  loginUserController,
  getProfileController,
  updateUserController,
  updatePasswordController,
} from "../controllers/authController.js";

import { verifyToken } from "../middleware/verifyToken.js";

import {
  registerValidation,
  loginValidation,
  updateUserValidation,
  updatePasswordValidation,
} from "../validators/authValidator.js";

import { validationHandler } from "../middleware/validationHandler.js";

const router = express.Router();

// criar usuario
router.post(
  "/auth/register",
  registerValidation,
  validationHandler,
  registerUserController
);

// login
router.post(
  "/auth/login",
  loginValidation,
  validationHandler,
  loginUserController
);

// pegar perfil do usuario (protegida)
router.get(
  "/auth/profile",
  verifyToken,
  getProfileController
);

// atualizar nome e email
router.put(
  "/auth/update",
  verifyToken,
  updateUserValidation,
  validationHandler,
  updateUserController
);

// atualizar senha
router.put(
  "/auth/update-password",
  verifyToken,
  updatePasswordValidation,
  validationHandler,
  updatePasswordController
);

export default router;
