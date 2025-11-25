import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import {
  loginRequest,
  registerRequest,
  getProfileRequest,
} from "../services/authService";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem("token");
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProfileRequest(token);
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

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const data = await loginRequest(email, password);
      localStorage.setItem("token", data.token);
      setUser(data.user);

      setToken(data.token);

      localStorage.setItem;
      "token", data.token;

      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
