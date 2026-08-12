import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";

function Dashboard() {
  const { usuario, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [registrosHoje, setRegistrosHoje] = useState([]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function irParaHistorico() {
    navigate("/historico");
  }

  function irParaAdmin() {
    navigate("/admin");
  }

  function obterDataHoje() {
    const agora = new Date();

    const ano = agora.getFullYear();

    const mes = String(
      agora.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
      agora.getDate()
    ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

  async function buscarRegistrosHoje() {
    try {
      const dataHoje = obterDataHoje();

      const response = await api.get(
        "/registros/meus-registros",
        {
          params: {
            data: dataHoje,
          },
        }
      );

      setRegistrosHoje(
        response.data.registros || []
      );
    } catch (error) {
      console.error(error);

      setErro(
        error.response?.data?.message ||
          "Erro ao buscar registros de hoje."
      );
    }
  }

  useEffect(() => {
    buscarRegistrosHoje();
  }, []);

  async function registrarPonto(tipo) {
    setMensagem("");
    setErro("");
    setCarregando(true);

    try {
      const response = await api.post(
        `/registros/${tipo}`
      );

      setMensagem(response.data.message);

      await buscarRegistrosHoje();
    } catch (error) {
      console.error(error);

      setErro(
        error.response?.data?.message ||
          "Erro ao registrar ponto."
      );
    } finally {
      setCarregando(false);
    }
  }

  function descobrirProximoRegistro() {
    if (registrosHoje.length === 0) {
      return "entrada";
    }

    const ordem = [
      "entrada",
      "inicio_almoco",
      "fim_almoco",
      "saida",
    ];

    const tiposRegistrados =
      registrosHoje.map(
        (registro) => registro.tipo
      );

    for (const tipo of ordem) {
      if (!tiposRegistrados.includes(tipo)) {
        return tipo;
      }
    }

    return null;
  }

  const proximoRegistro =
    descobrirProximoRegistro();

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-subtitle">
              Sistema de Ponto
            </p>

            <h1>
              Olá, {usuario?.nome}!
            </h1>
          </div>

          <button
            className="dashboard-logout"
            onClick={handleLogout}
          >
            Sair
          </button>
        </header>

        <section className="dashboard-user-card">
          <div>
            <span>E-mail</span>
            <strong>{usuario?.email}</strong>
          </div>

          <div>
            <span>Cargo</span>
            <strong>{usuario?.cargo}</strong>
          </div>
        </section>

        <section className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Registrar ponto</h2>

              <p>
                Registre as etapas da sua jornada de hoje.
              </p>
            </div>
          </div>

          {mensagem && (
            <div className="dashboard-message dashboard-message-success">
              {mensagem}
            </div>
          )}

          {erro && (
            <div className="dashboard-message dashboard-message-error">
              {erro}
            </div>
          )}

          <div className="dashboard-punch-grid">
            <button
              className="punch-button"
              onClick={() =>
                registrarPonto("entrada")
              }
              disabled={
                carregando ||
                proximoRegistro !== "entrada"
              }
            >
              <span className="punch-number">
                01
              </span>

              <span className="punch-title">
                Entrada
              </span>

              <span className="punch-description">
                Iniciar jornada
              </span>
            </button>

            <button
              className="punch-button"
              onClick={() =>
                registrarPonto(
                  "inicio-almoco"
                )
              }
              disabled={
                carregando ||
                proximoRegistro !==
                  "inicio_almoco"
              }
            >
              <span className="punch-number">
                02
              </span>

              <span className="punch-title">
                Início do almoço
              </span>

              <span className="punch-description">
                Iniciar intervalo
              </span>
            </button>

            <button
              className="punch-button"
              onClick={() =>
                registrarPonto(
                  "fim-almoco"
                )
              }
              disabled={
                carregando ||
                proximoRegistro !==
                  "fim_almoco"
              }
            >
              <span className="punch-number">
                03
              </span>

              <span className="punch-title">
                Fim do almoço
              </span>

              <span className="punch-description">
                Retornar do intervalo
              </span>
            </button>

            <button
              className="punch-button"
              onClick={() =>
                registrarPonto("saida")
              }
              disabled={
                carregando ||
                proximoRegistro !== "saida"
              }
            >
              <span className="punch-number">
                04
              </span>

              <span className="punch-title">
                Saída
              </span>

              <span className="punch-description">
                Encerrar jornada
              </span>
            </button>
          </div>

          {proximoRegistro === null && (
            <div className="dashboard-finished">
              Jornada de hoje concluída.
            </div>
          )}
        </section>

        <section className="dashboard-navigation">
          <button
            className="dashboard-navigation-card"
            onClick={irParaHistorico}
          >
            <span>Meu Histórico</span>

            <small>
              Consulte seus registros e horas trabalhadas.
            </small>
          </button>

          {usuario?.cargo ===
            "Administrador" && (
            <button
              className="dashboard-navigation-card"
              onClick={irParaAdmin}
            >
              <span>
                Área Administrativa
              </span>

              <small>
                Consulte usuários e registros.
              </small>
            </button>
          )}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;