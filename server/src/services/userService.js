import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  getUserByEmail,
  getUserById,
  createUser,
  updateUserById,
  updatePasswordById,
} from "../DAO/userDAO.js";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.JWT_SECRET_DEV ||
  "default_dev_secret";

// registrar usuario
export const registerUser = async (name, email, password) => {
  try {
    const exists = await getUserByEmail(email);
    if (exists) {
      throw new Error("E-mail já cadastrado.");
    }

    // hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // cria usuario
    const newUser = await createUser(name, email, hashedPassword);

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;

  } catch (error) {
    console.error("[userService] registerUser error:", error.message);
    throw error;
  }
};

// login usuario
export const loginUser = async (email, password) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("Usuário não cadastrado");
    }

    // compara senha
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      throw new Error("Senha incorreta");
    }

    // gera token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };

  } catch (error) {
    console.error("[userService] loginUser error:", error.message);
    throw error;
  }
};

// pegar perfil do usuario
export const getProfile = async (userId) => {
  try {
    const user = await getUserById(userId);
    if (!user) throw new Error("Usuário não encontrado.");

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;

  } catch (error) {
    console.error("[userService] getProfile error:", error.message);
    throw error;
  }
};

// atualizar nome e email
export const updateUser = async (userId, name, email) => {
  try {
    const updated = await updateUserById(userId, { name, email });
    if (!updated) throw new Error("Falha ao atualizar usuário.");

    const { password: _, ...userWithoutPassword } = updated;
    return userWithoutPassword;

  } catch (error) {
    console.error("[userService] updateUser error:", error.message);
    throw error;
  }
};

// atualizar senha
export const updatePassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await getUserById(userId);

    // verifica senha atual
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) throw new Error("Senha atual incorreta.");

    // hash nova senha
    const hashed = await bcrypt.hash(newPassword, 10);

    const success = await updatePasswordById(userId, hashed);
    if (!success) throw new Error("Erro ao atualizar senha.");

    return true;

  } catch (error) {
    console.error("[userService] updatePassword error:", error.message);
    throw error;
  }
};
