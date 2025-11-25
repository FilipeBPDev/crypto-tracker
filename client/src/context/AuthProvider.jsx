import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";

import {
  loginRequest,
  registerRequest,
  getProfileRequest,
  updateUserRequest,
  updatePasswordRequest,
} from "../services/authService";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // verifica se usuario esta autenticado
  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem("token");
  }, []);

  // carregar perfil ao iniciar app
  useEffect(() => {
    const loadProfile = async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProfileRequest(savedToken);
        setUser(data.user);
      } catch (err) {
        console.log("erro ao carregar perfil:", err.message);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const data = await loginRequest(email, password);

      // salva token e usuario
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);

      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // registrar usuario
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      const data = await registerRequest(name, email, password);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // atualizar nome e email
  const updateUser = async (name, email) => {
    try {
      setError(null);

      const data = await updateUserRequest(name, email, token);
      setUser(data.user);

      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // atualizar senha
  const updatePassword = async (oldPassword, newPassword) => {
    try {
      setError(null);

      await updatePasswordRequest(oldPassword, newPassword, token);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        updatePassword,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
