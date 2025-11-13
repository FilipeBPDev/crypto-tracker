import { useState } from "react";
import { loginRequest, registerRequest, getProfileRequest } from "../services/authService";

// hook autenticacao
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // funcao de login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // chama o service
      const data = await loginRequest(email, password);

      // salva token no localstorage
      localStorage.setItem("token", data.token);

      // salva dados do usuario
      setUser(data.user);

      return data.user;

    } catch (err) {
      setError(err.message);
      throw err;

    } finally {
      setLoading(false);
    }
  };

  // funcao de registro
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      // chamada ao service
      const data = await registerRequest(name, email, password);

      return data;

    } catch (err) {
      setError(err.message);
      throw err;

    } finally {
      setLoading(false);
    }
  };

  // busca rota protegida /profile
  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      // chamada ao service
      const data = await getProfileRequest(token);

      // atualiza usuario
      setUser(data.user);

      return data.user;

    } catch (err) {
      console.log("erro ao carregar perfil:", err.message);
      return null;
    }
  };

  // logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // verifica se esta autenticado
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    getProfile,
    isAuthenticated,
  };
};
