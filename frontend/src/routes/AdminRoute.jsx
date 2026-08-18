import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

function AdminRoute({ children }) {
  const { usuario, carregando } = useContext(AuthContext);

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const cargosPermitidos = ["CEO", "Administrador"];

  if (!cargosPermitidos.includes(usuario.cargo)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
