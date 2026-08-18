import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import Admin from "./pages/Admin/Admin";
import Historico from "./pages/Historico/Historico";
import RegistrosUsuario from "./pages/Admin/RegistrosUsuario";
import CadastrarUsuario from "./pages/CadastrarUsuario/CadastrarUsuario";

import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import CeoRoute from "./routes/CeoRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users/:id/registros"
        element={
          <AdminRoute>
            <RegistrosUsuario />
          </AdminRoute>
        }
      />

      <Route
        path="/historico"
        element={
          <PrivateRoute>
            <Historico />
          </PrivateRoute>
        }
      />

      <Route
        path="/cadastrar-usuario"
        element={
          <CeoRoute>
            <CadastrarUsuario />
          </CeoRoute>
        }
      />
    </Routes>
  );
}

export default App;
