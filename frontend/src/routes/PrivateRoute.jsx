import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

function PrivateRoute({ children }) {
  const { usuario, carregando } = useContext(AuthContext);

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;