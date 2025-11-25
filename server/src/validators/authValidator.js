import { body } from "express-validator";

// arquivo para validar dados de entrada

// validação para criar usuario
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

// validação para login
export const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email é obrigatório")
    .isEmail().withMessage("Email inválido")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Senha é obrigatória"),
];

// validação para atualizar nome e email
export const updateUserValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Nome é obrigatório")
    .isLength({ min: 2 }).withMessage("Nome muito curto"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email é obrigatório")
    .isEmail().withMessage("Email inválido")
    .normalizeEmail(),
];

// validação para trocar senha
export const updatePasswordValidation = [
  body("oldPassword")
    .notEmpty().withMessage("Senha atual é obrigatória"),

  body("newPassword")
    .notEmpty().withMessage("Nova senha é obrigatória")
    .isLength({ min: 6 }).withMessage("A nova senha deve ter no mínimo 6 caracteres"),
];
