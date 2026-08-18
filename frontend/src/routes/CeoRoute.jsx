import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

function CeoRoute({ children }) {
  const { usuario, carregando } =
    useContext(AuthContext);

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (!usuario) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (usuario.cargo !== "CEO") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

export default CeoRoute;