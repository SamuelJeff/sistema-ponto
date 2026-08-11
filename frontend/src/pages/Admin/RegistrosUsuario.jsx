import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

function RegistrosUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [registros, setRegistros] = useState([]);
  const [calculos, setCalculos] = useState([]);
  const [resumo, setResumo] = useState(null);

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
        `/admin/users/${id}/registros`,
        {
          params: filtros,
        }
      );

      setRegistros(
        response.data.registros || []
      );

      setCalculos(
        response.data.calculos || []
      );

      setResumo(
        response.data.resumo || null
      );
    } catch (error) {
      console.error(error);

      setErro(
        error.response?.data?.message ||
          "Erro ao buscar registros do usuário."
      );

      setRegistros([]);
      setCalculos([]);
      setResumo(null);
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
      setErro(
        "Informe o mês e o ano."
      );
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

  function converterDataParaIso(
    dataFormatada
  ) {
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

        grupos[data].push(
          registro
        );

        return grupos;
      },
      {}
    );
  }

  function ordenarRegistros(
    registrosDoDia
  ) {
    return [...registrosDoDia].sort(
      (a, b) =>
        ordemTipos[a.tipo] -
        ordemTipos[b.tipo]
    );
  }

  function buscarCalculoDoDia(
    dataFormatada
  ) {
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
    <div>
      <h1>
        Registros do Usuário
      </h1>

      <button onClick={voltarAdmin}>
        Voltar
      </button>

      <hr />

      {/* FILTRO POR DATA */}

      <h2>
        Filtrar por data
      </h2>

      <form onSubmit={buscarPorData}>
        <input
          type="date"
          value={data}
          onChange={(event) =>
            setData(
              event.target.value
            )
          }
        />

        <button type="submit">
          Buscar
        </button>
      </form>

      <hr />

      {/* FILTRO POR MÊS */}

      <h2>
        Filtrar por mês
      </h2>

      <form onSubmit={buscarPorMes}>
        <div>
          <label htmlFor="mes">
            Mês
          </label>

          <select
            id="mes"
            value={mes}
            onChange={(event) =>
              setMes(
                event.target.value
              )
            }
          >
            <option value="">
              Selecione
            </option>

            <option value="1">
              Janeiro
            </option>

            <option value="2">
              Fevereiro
            </option>

            <option value="3">
              Março
            </option>

            <option value="4">
              Abril
            </option>

            <option value="5">
              Maio
            </option>

            <option value="6">
              Junho
            </option>

            <option value="7">
              Julho
            </option>

            <option value="8">
              Agosto
            </option>

            <option value="9">
              Setembro
            </option>

            <option value="10">
              Outubro
            </option>

            <option value="11">
              Novembro
            </option>

            <option value="12">
              Dezembro
            </option>
          </select>
        </div>

        <div>
          <label htmlFor="ano">
            Ano
          </label>

          <input
            id="ano"
            type="number"
            value={ano}
            onChange={(event) =>
              setAno(
                event.target.value
              )
            }
            placeholder="2026"
          />
        </div>

        <button type="submit">
          Buscar
        </button>
      </form>

      <hr />

      {/* FILTRO POR INTERVALO */}

      <h2>
        Filtrar por intervalo
      </h2>

      <form
        onSubmit={
          buscarPorIntervalo
        }
      >
        <div>
          <label htmlFor="inicio">
            Data inicial
          </label>

          <input
            id="inicio"
            type="date"
            value={inicio}
            onChange={(event) =>
              setInicio(
                event.target.value
              )
            }
          />
        </div>

        <div>
          <label htmlFor="fim">
            Data final
          </label>

          <input
            id="fim"
            type="date"
            value={fim}
            onChange={(event) =>
              setFim(
                event.target.value
              )
            }
          />
        </div>

        <button type="submit">
          Buscar
        </button>
      </form>

      <br />

      <button
        onClick={
          limparFiltros
        }
      >
        Limpar filtros
      </button>

      <hr />

      {/* CARREGAMENTO */}

      {carregando && (
        <p>
          Carregando registros...
        </p>
      )}

      {/* ERRO */}

      {erro && (
        <p>{erro}</p>
      )}

      {/* RESUMO DO BACKEND */}

      {!carregando &&
        !erro &&
        resumo && (
          <div>
            <h2>
              Resumo do período
            </h2>

            <p>
              <strong>
                Dias completos:
              </strong>{" "}
              {
                resumo.diasCompletos
              }
            </p>

            <p>
              <strong>
                Dias incompletos:
              </strong>{" "}
              {
                resumo.diasIncompletos
              }
            </p>

            <p>
              <strong>
                Total trabalhado:
              </strong>{" "}
              {
                resumo.horasFormatadas
              }
            </p>

            <hr />
          </div>
        )}

      {/* SEM REGISTROS */}

      {!carregando &&
        !erro &&
        registros.length === 0 && (
          <p>
            Nenhum registro
            encontrado.
          </p>
        )}

      {/* REGISTROS */}

      {!carregando &&
        !erro &&
        registros.length > 0 &&
        Object.entries(
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
              <div
                key={
                  dataRegistro
                }
              >
                <h2>
                  {dataRegistro}
                </h2>

                <table>
                  <thead>
                    <tr>
                      <th>
                        Tipo
                      </th>

                      <th>
                        Hora
                      </th>
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
                              {nomesTipos[
                                registro.tipo
                              ] ||
                                registro.tipo}
                            </td>

                            <td>
                              {
                                hora
                              }
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>

                {/* CÁLCULO DO DIA */}

                {calculoDia?.completo ? (
                  <p>
                    <strong>
                      Total
                      trabalhado:
                    </strong>{" "}
                    {
                      calculoDia.horasFormatadas
                    }
                  </p>
                ) : (
                  <p>
                    Jornada ainda
                    não concluída.
                  </p>
                )}

                <hr />
              </div>
            );
          }
        )}
    </div>
  );
}

export default RegistrosUsuario;