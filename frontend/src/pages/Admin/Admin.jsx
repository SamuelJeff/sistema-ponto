import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

import api from "../../services/api";

function Admin() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarUsuarios() {
      try {
        const response = await api.get("/admin/users");

        setUsuarios(response.data);
      } catch (error) {
        console.error(error);

        setErro(
          error.response?.data?.message ||
            "Erro ao buscar usuários."
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarUsuarios();
  }, []);

  function voltarDashboard() {
    navigate("/dashboard");
  }

  function abrirHistoricoUsuario(id) {
    navigate(`/admin/users/${id}/registros`);
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <p className="admin-subtitle">
              Sistema de Ponto
            </p>

            <h1>Área Administrativa</h1>

            <p className="admin-description">
              Consulte os usuários cadastrados e seus registros de ponto.
            </p>
          </div>

          <button
            className="admin-back-button"
            onClick={voltarDashboard}
          >
            Voltar
          </button>
        </header>

        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Usuários</h2>

              <p>
                Usuários cadastrados no sistema.
              </p>
            </div>

            {!carregando && !erro && (
              <span className="admin-user-count">
                {usuarios.length}{" "}
                {usuarios.length === 1
                  ? "usuário"
                  : "usuários"}
              </span>
            )}
          </div>

          {carregando && (
            <div className="admin-status">
              Carregando usuários...
            </div>
          )}

          {erro && (
            <div className="admin-error">
              {erro}
            </div>
          )}

          {!carregando &&
            !erro &&
            usuarios.length === 0 && (
              <div className="admin-empty">
                Nenhum usuário encontrado.
              </div>
            )}

          {!carregando &&
            !erro &&
            usuarios.length > 0 && (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Cargo</th>
                      <th>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>
                          <div className="admin-user">
                            <div className="admin-user-avatar">
                              {usuario.nome
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>

                            <span>
                              {usuario.nome}
                            </span>
                          </div>
                        </td>

                        <td className="admin-email">
                          {usuario.email}
                        </td>

                        <td>
                          <span
                            className={`admin-role ${
                              usuario.cargo ===
                              "Administrador"
                                ? "admin-role-admin"
                                : "admin-role-user"
                            }`}
                          >
                            {usuario.cargo}
                          </span>
                        </td>

                        <td>
                          <button
                            className="admin-records-button"
                            onClick={() =>
                              abrirHistoricoUsuario(
                                usuario.id
                              )
                            }
                          >
                            Ver registros
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </section>
      </div>
    </main>
  );
}

export default Admin;