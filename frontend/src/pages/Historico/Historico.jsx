import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Historico.css";

import api from "../../services/api";

function Historico() {
  const navigate = useNavigate();

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

  const nomesTipos = {
    entrada: "Entrada",
    inicio_almoco: "Início do almoço",
    fim_almoco: "Fim do almoço",
    saida: "Saída",
  };

  const ordemTipos = {
    entrada: 1,
    inicio_almoco: 2,
    fim_almoco: 3,
    saida: 4,
  };

  async function buscarRegistros(filtros = {}) {
    setErro("");
    setCarregando(true);

    try {
      const response = await api.get(
        "/registros/meus-registros",
        {
          params: filtros,
        }
      );

      setRegistros(response.data.registros || []);
      setCalculos(response.data.calculos || []);
      setResumoMensal(
        response.data.resumoMensal || null
      );
    } catch (error) {
      console.error(error);

      setErro(
        error.response?.data?.message ||
          "Erro ao buscar histórico."
      );

      setRegistros([]);
      setCalculos([]);
      setResumoMensal(null);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarRegistros();
  }, []);

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
      setErro(
        "Informe a data inicial e a data final."
      );

      return;
    }

    if (inicio > fim) {
      setErro(
        "A data inicial não pode ser maior que a data final."
      );

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

  function voltarDashboard() {
    navigate("/dashboard");
  }

  function separarDataHora(dataHora) {
    const partes = dataHora.split(",");

    return {
      data: partes[0]?.trim(),
      hora: partes[1]?.trim(),
    };
  }

  function converterDataParaIso(dataFormatada) {
    const [dia, mes, ano] =
      dataFormatada.split("/");

    return `${ano}-${mes}-${dia}`;
  }

  function agruparRegistrosPorData() {
    return registros.reduce(
      (grupos, registro) => {
        const { data } =
          separarDataHora(
            registro.data_hora
          );

        if (!grupos[data]) {
          grupos[data] = [];
        }

        grupos[data].push(registro);

        return grupos;
      },
      {}
    );
  }

  function ordenarRegistros(registrosDoDia) {
    return [...registrosDoDia].sort(
      (a, b) =>
        ordemTipos[a.tipo] -
        ordemTipos[b.tipo]
    );
  }

  function buscarCalculoDoDia(dataFormatada) {
    const dataIso =
      converterDataParaIso(
        dataFormatada
      );

    return calculos.find(
      (calculo) =>
        calculo.data === dataIso
    );
  }

  const registrosAgrupados =
    agruparRegistrosPorData();

  return (
    <main className="historico-page">
      <div className="historico-container">
        <header className="historico-header">
          <div>
            <p className="historico-subtitle">
              Sistema de Ponto
            </p>

            <h1>Meu Histórico</h1>

            <p className="historico-description">
              Consulte seus registros e horas trabalhadas.
            </p>
          </div>

          <button
            className="historico-back-button"
            onClick={voltarDashboard}
          >
            Voltar
          </button>
        </header>

        <section className="historico-filter-card">
          <div className="historico-section-title">
            <h2>Filtros</h2>

            <p>
              Escolha uma das opções abaixo para consultar
              seus registros.
            </p>
          </div>

          <div className="historico-filters-grid">
            <form
              className="historico-filter"
              onSubmit={buscarPorData}
            >
              <h3>Data específica</h3>

              <div className="historico-field">
                <label htmlFor="data">
                  Data
                </label>

                <input
                  id="data"
                  type="date"
                  value={data}
                  onChange={(event) =>
                    setData(event.target.value)
                  }
                />
              </div>

              <button type="submit">
                Buscar
              </button>
            </form>

            <form
              className="historico-filter"
              onSubmit={buscarPorMes}
            >
              <h3>Mês</h3>

              <div className="historico-field">
                <label htmlFor="mes">
                  Mês
                </label>

                <select
                  id="mes"
                  value={mes}
                  onChange={(event) =>
                    setMes(event.target.value)
                  }
                >
                  <option value="">
                    Selecione
                  </option>

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

              <div className="historico-field">
                <label htmlFor="ano">
                  Ano
                </label>

                <input
                  id="ano"
                  type="number"
                  value={ano}
                  onChange={(event) =>
                    setAno(event.target.value)
                  }
                  placeholder="2026"
                />
              </div>

              <button type="submit">
                Buscar
              </button>
            </form>

            <form
              className="historico-filter"
              onSubmit={buscarPorIntervalo}
            >
              <h3>Intervalo</h3>

              <div className="historico-field">
                <label htmlFor="inicio">
                  Data inicial
                </label>

                <input
                  id="inicio"
                  type="date"
                  value={inicio}
                  onChange={(event) =>
                    setInicio(event.target.value)
                  }
                />
              </div>

              <div className="historico-field">
                <label htmlFor="fim">
                  Data final
                </label>

                <input
                  id="fim"
                  type="date"
                  value={fim}
                  onChange={(event) =>
                    setFim(event.target.value)
                  }
                />
              </div>

              <button type="submit">
                Buscar
              </button>
            </form>
          </div>

          <div className="historico-filter-actions">
            <button
              className="historico-clear-button"
              onClick={limparFiltros}
            >
              Limpar filtros
            </button>
          </div>
        </section>

        {carregando && (
          <div className="historico-status">
            Carregando registros...
          </div>
        )}

        {erro && (
          <div className="historico-error">
            {erro}
          </div>
        )}

        {!carregando &&
          !erro &&
          resumoMensal && (
            <section className="historico-summary">
              <div className="historico-section-title">
                <h2>Resumo mensal</h2>

                <p>
                  {resumoMensal.mes}/
                  {resumoMensal.ano}
                </p>
              </div>

              <div className="historico-summary-grid">
                <div className="summary-card">
                  <span>
                    Dias trabalhados
                  </span>

                  <strong>
                    {
                      resumoMensal.diasTrabalhados
                    }
                  </strong>
                </div>

                <div className="summary-card">
                  <span>
                    Dias completos
                  </span>

                  <strong>
                    {
                      resumoMensal.diasCompletos
                    }
                  </strong>
                </div>

                <div className="summary-card">
                  <span>
                    Dias incompletos
                  </span>

                  <strong>
                    {
                      resumoMensal.diasIncompletos
                    }
                  </strong>
                </div>

                <div className="summary-card summary-card-highlight">
                  <span>
                    Total trabalhado
                  </span>

                  <strong>
                    {
                      resumoMensal.horasFormatadas
                    }
                  </strong>
                </div>
              </div>
            </section>
          )}

        {!carregando &&
          !erro &&
          registros.length === 0 && (
            <div className="historico-empty">
              Nenhum registro encontrado.
            </div>
          )}

        {!carregando &&
          !erro &&
          registros.length > 0 && (
            <section className="historico-records">
              <div className="historico-section-title">
                <h2>Registros</h2>

                <p>
                  Histórico detalhado da sua jornada.
                </p>
              </div>

              <div className="historico-days">
                {Object.entries(
                  registrosAgrupados
                ).map(
                  ([
                    dataRegistro,
                    registrosDoDia,
                  ]) => {
                    const registrosOrdenados =
                      ordenarRegistros(
                        registrosDoDia
                      );

                    const calculoDia =
                      buscarCalculoDoDia(
                        dataRegistro
                      );

                    return (
                      <article
                        className="historico-day-card"
                        key={dataRegistro}
                      >
                        <div className="historico-day-header">
                          <h3>
                            {dataRegistro}
                          </h3>

                          {calculoDia?.completo ? (
                            <span className="historico-day-status historico-day-complete">
                              Jornada completa
                            </span>
                          ) : (
                            <span className="historico-day-status historico-day-incomplete">
                              Jornada incompleta
                            </span>
                          )}
                        </div>

                        <div className="historico-table-wrapper">
                          <table className="historico-table">
                            <thead>
                              <tr>
                                <th>Tipo</th>
                                <th>Hora</th>
                              </tr>
                            </thead>

                            <tbody>
                              {registrosOrdenados.map(
                                (
                                  registro,
                                  index
                                ) => {
                                  const {
                                    hora,
                                  } =
                                    separarDataHora(
                                      registro.data_hora
                                    );

                                  return (
                                    <tr
                                      key={
                                        index
                                      }
                                    >
                                      <td>
                                        <span
                                          className={`historico-type historico-type-${registro.tipo}`}
                                        >
                                          {nomesTipos[
                                            registro.tipo
                                          ] ||
                                            registro.tipo}
                                        </span>
                                      </td>

                                      <td className="historico-time">
                                        {hora}
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="historico-day-total">
                          {calculoDia?.completo ? (
                            <>
                              <span>
                                Total trabalhado
                              </span>

                              <strong>
                                {
                                  calculoDia.horasFormatadas
                                }
                              </strong>
                            </>
                          ) : (
                            <span>
                              Jornada ainda não concluída.
                            </span>
                          )}
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </section>
          )}
      </div>
    </main>
  );
}

export default Historico;