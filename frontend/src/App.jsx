import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Admin from "./pages/Admin/Admin";
import Historico from "./pages/Historico/Historico";
import RegistrosUsuario from "./pages/Admin/RegistrosUsuario";

import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />

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
    </Routes>
  );
}

export default App;
