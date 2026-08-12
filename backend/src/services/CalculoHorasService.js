function obterDataRecife(dataHora) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Recife",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(dataHora));
}

function formatarSegundos(totalSegundos) {
  const horas = Math.floor(
    totalSegundos / 3600
  );

  const minutos = Math.floor(
    (totalSegundos % 3600) / 60
  );

  const segundos =
    totalSegundos % 60;

  return (
    `${String(horas).padStart(2, "0")}:` +
    `${String(minutos).padStart(2, "0")}:` +
    `${String(segundos).padStart(2, "0")}`
  );
}

function calcularHorasTrabalhadas(registros) {
  if (!registros || registros.length === 0) {
    return {
      completo: false,
      segundosTrabalhados: null,
      minutosTrabalhados: null,
      horasFormatadas: null,
    };
  }

  const registrosOrdenados =
    [...registros].sort(
      (a, b) =>
        new Date(a.data_hora).getTime() -
        new Date(b.data_hora).getTime()
    );

  let entrada = null;
  let inicioAlmoco = null;
  let fimAlmoco = null;
  let saida = null;

  for (const registro of registrosOrdenados) {
    if (
      registro.tipo === "entrada" &&
      !entrada
    ) {
      entrada = registro;
      continue;
    }

    if (
      registro.tipo === "inicio_almoco" &&
      entrada &&
      !inicioAlmoco
    ) {
      inicioAlmoco = registro;
      continue;
    }

    if (
      registro.tipo === "fim_almoco" &&
      entrada &&
      inicioAlmoco &&
      !fimAlmoco
    ) {
      fimAlmoco = registro;
      continue;
    }

    if (
      registro.tipo === "saida" &&
      entrada &&
      inicioAlmoco &&
      fimAlmoco &&
      !saida
    ) {
      saida = registro;
      break;
    }
  }

  if (
    !entrada ||
    !inicioAlmoco ||
    !fimAlmoco ||
    !saida
  ) {
    return {
      completo: false,
      segundosTrabalhados: null,
      minutosTrabalhados: null,
      horasFormatadas: null,
    };
  }

  const entradaData =
    new Date(entrada.data_hora);

  const inicioAlmocoData =
    new Date(inicioAlmoco.data_hora);

  const fimAlmocoData =
    new Date(fimAlmoco.data_hora);

  const saidaData =
    new Date(saida.data_hora);

  const periodoManha =
    inicioAlmocoData.getTime() -
    entradaData.getTime();

  const periodoTarde =
    saidaData.getTime() -
    fimAlmocoData.getTime();

  if (
    periodoManha < 0 ||
    periodoTarde < 0
  ) {
    return {
      completo: false,
      segundosTrabalhados: null,
      minutosTrabalhados: null,
      horasFormatadas: null,
    };
  }

  const totalMilissegundos =
    periodoManha + periodoTarde;

  const segundosTrabalhados =
    Math.floor(
      totalMilissegundos / 1000
    );

  const minutosTrabalhados =
    Math.floor(
      segundosTrabalhados / 60
    );

  const horasFormatadas =
    formatarSegundos(
      segundosTrabalhados
    );

  return {
    completo: true,
    segundosTrabalhados,
    minutosTrabalhados,
    horasFormatadas,
  };
}

function calcularHorasPorDia(registros) {
  const registrosPorDia =
    registros.reduce(
      (grupos, registro) => {
        const data =
          obterDataRecife(
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

  return Object.entries(
    registrosPorDia
  ).map(
    ([data, registrosDoDia]) => {
      const calculo =
        calcularHorasTrabalhadas(
          registrosDoDia
        );

      return {
        data,
        ...calculo,
      };
    }
  );
}

function calcularResumoMensal(
  calculos,
  mes,
  ano
) {
  const diasTrabalhados =
    calculos.length;

  const diasCompletos =
    calculos.filter(
      (calculo) => calculo.completo
    );

  const diasIncompletos =
    calculos.filter(
      (calculo) => !calculo.completo
    );

  const segundosTrabalhados =
    diasCompletos.reduce(
      (total, calculo) => {
        return (
          total +
          (calculo.segundosTrabalhados || 0)
        );
      },
      0
    );

  return {
    mes: Number(mes),
    ano: Number(ano),

    diasTrabalhados,

    diasCompletos:
      diasCompletos.length,

    diasIncompletos:
      diasIncompletos.length,

    segundosTrabalhados,

    horasFormatadas:
      formatarSegundos(
        segundosTrabalhados
      ),
  };
}

module.exports = {
  calcularHorasTrabalhadas,
  calcularHorasPorDia,
  calcularResumoMensal,
};