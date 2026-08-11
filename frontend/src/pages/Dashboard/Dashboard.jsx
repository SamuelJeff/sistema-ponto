import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>Sistema de Ponto</h1>

      <h2>
        Olá, {usuario?.nome}!
      </h2>

      <p>
        E-mail: {usuario?.email}
      </p>

      <p>
        Cargo: {usuario?.cargo}
      </p>

      <hr />

      <h2>Registrar Ponto</h2>

      {mensagem && (
        <p>{mensagem}</p>
      )}

      {erro && (
        <p>{erro}</p>
      )}

      <button
        onClick={() =>
          registrarPonto("entrada")
        }
        disabled={
          carregando ||
          proximoRegistro !== "entrada"
        }
      >
        Registrar Entrada
      </button>

      <button
        onClick={() =>
          registrarPonto("inicio-almoco")
        }
        disabled={
          carregando ||
          proximoRegistro !== "inicio_almoco"
        }
      >
        Início do Almoço
      </button>

      <button
        onClick={() =>
          registrarPonto("fim-almoco")
        }
        disabled={
          carregando ||
          proximoRegistro !== "fim_almoco"
        }
      >
        Fim do Almoço
      </button>

      <button
        onClick={() =>
          registrarPonto("saida")
        }
        disabled={
          carregando ||
          proximoRegistro !== "saida"
        }
      >
        Registrar Saída
      </button>

      {proximoRegistro === null && (
        <p>
          Jornada de hoje concluída.
        </p>
      )}

      <hr />

      <button onClick={irParaHistorico}>
        Meu Histórico
      </button>

      {usuario?.cargo === "Administrador" && (
        <button onClick={irParaAdmin}>
          Área Administrativa
        </button>
      )}

      <hr />

      <button onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}

export default Dashboard;