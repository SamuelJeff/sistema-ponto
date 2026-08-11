import { createContext, useEffect, useState } from "react";
import api from "../services/api";
export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    async function carregarUsuario() {
      const token = localStorage.getItem("token");
      if (!token) {
        setCarregando(false);
        return;
      }
      try {
        const response = await api.get("/users/profile");
        setUsuario(response.data);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        localStorage.removeItem("token");
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    }
    carregarUsuario();
  }, []);
  function login(token, usuario) {
    localStorage.setItem("token", token);
    setUsuario(usuario);
  }
  function logout() {
    localStorage.removeItem("token");
    setUsuario(null);
  }
  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando }}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
}
