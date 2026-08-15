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

function formatarSaldoSegundos(totalSegundos) {
  const sinal =
    totalSegundos > 0
      ? "+"
      : totalSegundos < 0
        ? "-"
        : "";

  const segundosAbsolutos =
    Math.abs(totalSegundos);

  return (
    sinal +
    formatarSegundos(
      segundosAbsolutos
    )
  );
}

function calcularHorasTrabalhadas(
  registros,
  jornadaDiariaMinutos = 480
) {
  if (!registros || registros.length === 0) {
    return {
      completo: false,

      segundosTrabalhados: null,
      minutosTrabalhados: null,
      horasFormatadas: null,

      jornadaDiariaMinutos,
      jornadaEsperadaFormatada:
        formatarSegundos(
          jornadaDiariaMinutos * 60
        ),

      saldoSegundos: null,
      saldoFormatado: null,
      segundosExtras: null,
      horasExtrasFormatadas: null,
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

      jornadaDiariaMinutos,
      jornadaEsperadaFormatada:
        formatarSegundos(
          jornadaDiariaMinutos * 60
        ),

      saldoSegundos: null,
      saldoFormatado: null,
      segundosExtras: null,
      horasExtrasFormatadas: null,
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

      jornadaDiariaMinutos,
      jornadaEsperadaFormatada:
        formatarSegundos(
          jornadaDiariaMinutos * 60
        ),

      saldoSegundos: null,
      saldoFormatado: null,
      segundosExtras: null,
      horasExtrasFormatadas: null,
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

  const jornadaEsperadaSegundos =
    jornadaDiariaMinutos * 60;

  const saldoSegundos =
    segundosTrabalhados -
    jornadaEsperadaSegundos;

  const segundosExtras =
    Math.max(
      saldoSegundos,
      0
    );

  return {
    completo: true,

    segundosTrabalhados,
    minutosTrabalhados,
    horasFormatadas,

    jornadaDiariaMinutos,

    jornadaEsperadaFormatada:
      formatarSegundos(
        jornadaEsperadaSegundos
      ),

    saldoSegundos,

    saldoFormatado:
      formatarSaldoSegundos(
        saldoSegundos
      ),

    segundosExtras,

    horasExtrasFormatadas:
      formatarSegundos(
        segundosExtras
      ),
  };
}

function calcularHorasPorDia(
  registros,
  jornadaDiariaMinutos = 480
) {
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
          registrosDoDia,
          jornadaDiariaMinutos
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

  const saldoSegundos =
    diasCompletos.reduce(
      (total, calculo) => {
        return (
          total +
          (calculo.saldoSegundos || 0)
        );
      },
      0
    );

  const segundosExtras =
    diasCompletos.reduce(
      (total, calculo) => {
        return (
          total +
          (calculo.segundosExtras || 0)
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

    saldoSegundos,

    saldoFormatado:
      formatarSaldoSegundos(
        saldoSegundos
      ),

    segundosExtras,

    horasExtrasFormatadas:
      formatarSegundos(
        segundosExtras
      ),
  };
}

module.exports = {
  calcularHorasTrabalhadas,
  calcularHorasPorDia,
  calcularResumoMensal,
};