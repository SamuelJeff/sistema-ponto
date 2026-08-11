import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>Área Administrativa</h1>

      <button onClick={voltarDashboard}>
        Voltar
      </button>

      <hr />

      <h2>Usuários</h2>

      {carregando && (
        <p>Carregando usuários...</p>
      )}

      {erro && (
        <p>{erro}</p>
      )}

      {!carregando &&
        !erro &&
        usuarios.length === 0 && (
          <p>Nenhum usuário encontrado.</p>
        )}

      {!carregando &&
        !erro &&
        usuarios.length > 0 && (
          <table>
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
                  <td>{usuario.nome}</td>

                  <td>{usuario.email}</td>

                  <td>{usuario.cargo}</td>

                  <td>
                    <button
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
        )}
    </div>
  );
}

export default Admin;