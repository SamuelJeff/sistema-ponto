import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./RegistrosUsuario.css";

import api from "../../services/api";

function RegistrosUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [usuario, setUsuario] = useState(null);

  const [registros, setRegistros] = useState([]);
  const [calculos, setCalculos] = useState([]);
  const [resumoMensal, setResumoMensal] = useState(null);

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  const [data, setData] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");

  async function buscarRegistros(filtros = {}) {
    setErro("");
    setCarregando(true);

    try {
      const response = await api.get(`/admin/users/${id}/registros`, {
        params: filtros,
      });

      setUsuario(response.data.usuario || null);

      setRegistros(response.data.registros || []);

      setCalculos(response.data.calculos || []);

      setResumoMensal(response.data.resumoMensal || null);
    } catch (error) {
      console.error(error);

      setErro(
        error.response?.data?.message || "Erro ao buscar registros do usuário.",
      );

      setUsuario(null);
      setRegistros([]);
      setCalculos([]);
      setResumoMensal(null);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarRegistros();
  }, [id]);

  function buscarPorData(event) {
    event.preventDefault();

    if (!data) {
      setErro("Informe uma data.");
      return;
    }

    buscarRegistros({
      data,
    });
  }

  function buscarPorMes(event) {
    event.preventDefault();

    if (!mes || !ano) {
      setErro("Informe o mês e o ano.");

      return;
    }

    buscarRegistros({
      mes,
      ano,
    });
  }

  function buscarPorIntervalo(event) {
    event.preventDefault();

    if (!inicio || !fim) {
      setErro("Informe a data inicial e a data final.");

      return;
    }

    if (inicio > fim) {
      setErro("A data inicial não pode ser maior que a data final.");

      return;
    }

    buscarRegistros({
      inicio,
      fim,
    });
  }

  function limparFiltros() {
    setData("");
    setMes("");
    setAno("");
    setInicio("");
    setFim("");
    setErro("");
    setResumoMensal(null);

    buscarRegistros();
  }

  function voltarAdmin() {
    navigate("/admin");
  }

  function separarDataHora(dataHora) {
    const partes = dataHora.split(",");

    return {
      data: partes[0]?.trim(),

      hora: partes[1]?.trim(),
    };
  }

  function converterDataParaIso(dataFormatada) {
    const [dia, mes, ano] = dataFormatada.split("/");

    return `${ano}-${mes}-${dia}`;
  }

  function agruparRegistrosPorData() {
    return registros.reduce((grupos, registro) => {
      const { data } = separarDataHora(registro.data_hora);

      if (!grupos[data]) {
        grupos[data] = [];
      }

      grupos[data].push(registro);

      return grupos;
    }, {});
  }

  function buscarCalculoDoDia(dataFormatada) {
    const dataIso = converterDataParaIso(dataFormatada);

    return calculos.find((calculo) => calculo.data === dataIso);
  }

  function buscarHoraDoRegistro(registrosDoDia, tipo) {
    const registro = registrosDoDia.find((item) => item.tipo === tipo);

    if (!registro) {
      return "-";
    }

    const { hora } = separarDataHora(registro.data_hora);

    return hora || "-";
  }

  function formatarJornadaMinutos(minutosTotais) {
    if (minutosTotais === null || minutosTotais === undefined) {
      return "-";
    }

    const horas = Math.floor(minutosTotais / 60);

    const minutos = minutosTotais % 60;

    if (minutos === 0) {
      return `${horas}h`;
    }

    return `${horas}h ${minutos}min`;
  }

  function montarLinhasHistorico() {
    const registrosAgrupados = agruparRegistrosPorData();

    return Object.entries(registrosAgrupados)
      .map(([dataRegistro, registrosDoDia]) => {
        const calculoDia = buscarCalculoDoDia(dataRegistro);

        return {
          data: dataRegistro,

          entrada: buscarHoraDoRegistro(registrosDoDia, "entrada"),

          inicioAlmoco: buscarHoraDoRegistro(registrosDoDia, "inicio_almoco"),

          fimAlmoco: buscarHoraDoRegistro(registrosDoDia, "fim_almoco"),

          saida: buscarHoraDoRegistro(registrosDoDia, "saida"),

          trabalhado: calculoDia?.horasFormatadas || "-",

          jornada: calculoDia?.jornadaEsperadaFormatada || "-",

          saldo: calculoDia?.saldoFormatado || "-",

          saldoSegundos: calculoDia?.saldoSegundos ?? null,

          extras: calculoDia?.horasExtrasFormatadas || "-",
        };
      })
      .sort((a, b) => {
        const dataA = converterDataParaIso(a.data);

        const dataB = converterDataParaIso(b.data);

        return dataB.localeCompare(dataA);
      });
  }

  const linhasHistorico = montarLinhasHistorico();

  return (
    <main className="registros-usuario-page">
      <div className="registros-usuario-container">
        <header className="registros-usuario-header">
          <div>
            <p className="registros-usuario-subtitle">Área Administrativa</p>

            <h1>
              {usuario
                ? `Registros de ${usuario.nome}`
                : "Registros do Usuário"}
            </h1>

            <p className="registros-usuario-description">
              Consulte registros, jornadas, saldo e horas extras do funcionário.
            </p>
          </div>

          <button className="registros-usuario-back" onClick={voltarAdmin}>
            Voltar
          </button>
        </header>

        {usuario && (
          <section className="registros-usuario-info">
            <div>
              <span>E-mail</span>

              <strong>{usuario.email}</strong>
            </div>

            <div>
              <span>Cargo</span>

              <strong>{usuario.cargo}</strong>
            </div>

            <div>
              <span>Jornada diária</span>

              <strong>
                {formatarJornadaMinutos(usuario.jornada_diaria_minutos)}
              </strong>
            </div>
          </section>
        )}

        <section className="registros-usuario-filter-card">
          <div className="registros-usuario-section-title">
            <h2>Filtros</h2>

            <p>Selecione uma forma de consulta.</p>
          </div>

          <div className="registros-usuario-filters-grid">
            <form className="registros-usuario-filter" onSubmit={buscarPorData}>
              <h3>Data específica</h3>

              <div className="registros-usuario-field">
                <label htmlFor="data">Data</label>

                <input
                  id="data"
                  type="date"
                  value={data}
                  onChange={(event) => setData(event.target.value)}
                />
              </div>

              <button type="submit">Buscar</button>
            </form>

            <form className="registros-usuario-filter" onSubmit={buscarPorMes}>
              <h3>Mês</h3>

              <div className="registros-usuario-field">
                <label htmlFor="mes">Mês</label>

                <select
                  id="mes"
                  value={mes}
                  onChange={(event) => setMes(event.target.value)}
                >
                  <option value="">Selecione</option>

                  <option value="1">Janeiro</option>

                  <option value="2">Fevereiro</option>

                  <option value="3">Março</option>

                  <option value="4">Abril</option>

                  <option value="5">Maio</option>

                  <option value="6">Junho</option>

                  <option value="7">Julho</option>

                  <option value="8">Agosto</option>

                  <option value="9">Setembro</option>

                  <option value="10">Outubro</option>

                  <option value="11">Novembro</option>

                  <option value="12">Dezembro</option>
                </select>
              </div>

              <div className="registros-usuario-field">
                <label htmlFor="ano">Ano</label>

                <input
                  id="ano"
                  type="number"
                  value={ano}
                  onChange={(event) => setAno(event.target.value)}
                  placeholder="2026"
                />
              </div>

              <button type="submit">Buscar</button>
            </form>

            <form
              className="registros-usuario-filter"
              onSubmit={buscarPorIntervalo}
            >
              <h3>Intervalo</h3>

              <div className="registros-usuario-field">
                <label htmlFor="inicio">Data inicial</label>

                <input
                  id="inicio"
                  type="date"
                  value={inicio}
                  onChange={(event) => setInicio(event.target.value)}
                />
              </div>

              <div className="registros-usuario-field">
                <label htmlFor="fim">Data final</label>

                <input
                  id="fim"
                  type="date"
                  value={fim}
                  onChange={(event) => setFim(event.target.value)}
                />
              </div>

              <button type="submit">Buscar</button>
            </form>
          </div>

          <div className="registros-usuario-filter-actions">
            <button className="registros-usuario-clear" onClick={limparFiltros}>
              Limpar filtros
            </button>
          </div>
        </section>

        {carregando && (
          <div className="registros-usuario-status">
            Carregando registros...
          </div>
        )}

        {erro && <div className="registros-usuario-error">{erro}</div>}

        {!carregando && !erro && resumoMensal && (
          <section className="registros-usuario-summary">
            <div className="registros-usuario-section-title">
              <h2>Resumo mensal</h2>

              <p>
                {resumoMensal.mes}/{resumoMensal.ano}
              </p>
            </div>

            <div className="registros-usuario-summary-grid">
              <div className="registros-summary-card">
                <span>Dias trabalhados</span>

                <strong>{resumoMensal.diasTrabalhados}</strong>
              </div>

              <div className="registros-summary-card">
                <span>Dias completos</span>

                <strong>{resumoMensal.diasCompletos}</strong>
              </div>

              <div className="registros-summary-card">
                <span>Dias incompletos</span>

                <strong>{resumoMensal.diasIncompletos}</strong>
              </div>

              <div className="registros-summary-card">
                <span>Total trabalhado</span>

                <strong>{resumoMensal.horasFormatadas}</strong>
              </div>

              <div
                className={`registros-summary-card ${
                  resumoMensal.saldoSegundos > 0
                    ? "registros-summary-positive"
                    : resumoMensal.saldoSegundos < 0
                      ? "registros-summary-negative"
                      : ""
                }`}
              >
                <span>Saldo do mês</span>

                <strong>{resumoMensal.saldoFormatado}</strong>
              </div>

              <div className="registros-summary-card registros-summary-highlight">
                <span>Horas extras</span>

                <strong>{resumoMensal.horasExtrasFormatadas}</strong>
              </div>
            </div>
          </section>
        )}

        {!carregando && !erro && linhasHistorico.length === 0 && (
          <div className="registros-usuario-empty">
            Nenhum registro encontrado.
          </div>
        )}

        {!carregando && !erro && linhasHistorico.length > 0 && (
          <section className="registros-usuario-records">
            <div className="registros-usuario-section-title">
              <h2>Registros</h2>

              <p>Histórico completo da jornada do funcionário.</p>
            </div>

            <div className="registros-usuario-full-table-wrapper">
              <table className="registros-usuario-full-table">
                <thead>
                  <tr>
                    <th>Data</th>

                    <th>Entrada</th>

                    <th>Início almoço</th>

                    <th>Fim almoço</th>

                    <th>Saída</th>

                    <th>Trabalhado</th>

                    <th>Jornada</th>

                    <th>Saldo</th>

                    <th>Extras</th>
                  </tr>
                </thead>

                <tbody>
                  {linhasHistorico.map((linha) => (
                    <tr key={linha.data}>
                      <td className="registros-usuario-full-table-date">
                        {linha.data}
                      </td>

                      <td>{linha.entrada}</td>

                      <td>{linha.inicioAlmoco}</td>

                      <td>{linha.fimAlmoco}</td>

                      <td>{linha.saida}</td>

                      <td className="registros-usuario-full-table-worked">
                        {linha.trabalhado}
                      </td>

                      <td>{linha.jornada}</td>

                      <td>
                        <span
                          className={
                            linha.saldoSegundos > 0
                              ? "registros-usuario-table-saldo-positive"
                              : linha.saldoSegundos < 0
                                ? "registros-usuario-table-saldo-negative"
                                : "registros-usuario-table-saldo-neutral"
                          }
                        >
                          {linha.saldo}
                        </span>
                      </td>

                      <td>
                        <strong className="registros-usuario-table-extra">
                          {linha.extras}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default RegistrosUsuario;
