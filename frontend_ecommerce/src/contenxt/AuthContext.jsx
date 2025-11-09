import React, { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Optionally parse token to set user info
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (userName, password) => {
    const res = await axiosClient.post("/auth/login", { userName, password });
    const t = res.data?.token;
    if (t) {
      setToken(t);
      return true;
    }
    return false;
  };

  const register = async (userName, email, password) => {
    const res = await axiosClient.post("/auth/register", { userName, email, password });
    const t = res.data?.token;
    if (t) {
      setToken(t);
      return true;
    }
    return false;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
