import {
  registerUser,
  loginUser,
  getProfile,
  updateUser,
  updatePassword,
} from "../services/userService.js";

// registrar usuario
export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Dados incompletos." });
    }

    const user = await registerUser(name, email, password);

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      user,
    });

  } catch (error) {
    console.error("[authController] registerUserController error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// login usuario
export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios." });
    }

    const { user, token } = await loginUser(email, password);

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      user,
      token,
    });

  } catch (error) {
    console.error("[authController] loginUserController error:", error.message);

    const status =
      error.message === "Usuário não cadastrado" ||
      error.message === "Senha incorreta"
        ? 401
        : 500;

    return res.status(status).json({ error: error.message });
  }
};

// pegar perfil
export const getProfileController = async (req, res) => {
  try {
    const user = await getProfile(req.user.id);

    return res.status(200).json({
      message: "Perfil carregado com sucesso!",
      user,
    });

  } catch (error) {
    console.error("[authController] getProfileController error:", error.message);
    return res.status(500).json({ error: "Erro ao carregar perfil." });
  }
};

// atualizar nome e email
export const updateUserController = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Dados incompletos." });
    }

    const updatedUser = await updateUser(req.user.id, name, email);

    return res.status(200).json({
      message: "Dados atualizados com sucesso!",
      user: updatedUser,
    });

  } catch (error) {
    console.error("[authController] updateUserController error:", error.message);
    return res.status(500).json({ error: "Erro ao atualizar dados." });
  }
};

// atualizar senha
export const updatePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Preencha todos os campos." });
    }

    await updatePassword(req.user.id, oldPassword, newPassword);

    return res.status(200).json({
      message: "Senha atualizada com sucesso!",
    });

  } catch (error) {
    console.error("[authController] updatePasswordController error:", error.message);

    const status =
      error.message === "Senha atual incorreta." ? 401 : 500;

    return res.status(status).json({ error: error.message });
  }
};
