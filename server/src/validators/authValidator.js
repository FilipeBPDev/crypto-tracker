import { body } from "express-validator";

//arquivo para válidar dados de entrada.

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Nome é obrigatório")
    .isLength({ min: 2 }).withMessage("Nome muito curto"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email é obrigatório")
    .isEmail().withMessage("Email inválido")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Senha é obrigatória")
    .isLength({ min: 6 }).withMessage("A senha deve ter no mínimo 6 caracteres"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email é obrigatório")
    .isEmail().withMessage("Email inválido")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Senha é obrigatória")
];
