const RegistroModel = require("../models/RegistroModel");
const AppError = require("../errors/AppError");

class RegistroService {
  proximosRegistros = {
    entrada: "inicio_almoco",
    inicio_almoco: "fim_almoco",
    fim_almoco: "saida",
    saida: null,
  };

  mensagensErro = {
    primeiroRegistro:
      "O primeiro registro do dia deve ser uma entrada.",

    entradaDuplicada:
      "Você já registrou a entrada.",

    diaEncerrado:
      "O ponto deste dia já foi encerrado.",

    sequenciaInvalida:
      "A sequência de registros é inválida.",
  };

  async registrarPonto(userId, tipo) {
    const ultimoRegistro =
      await RegistroModel.findLastByUserToday(
        userId
      );

    /*
     * Primeiro registro do dia
     * obrigatoriamente deve ser entrada.
     */
    if (
      !ultimoRegistro &&
      tipo !== "entrada"
    ) {
      throw new AppError(
        this.mensagensErro.primeiroRegistro,
        400
      );
    }

    /*
     * Caso já exista algum registro hoje,
     * verifica a sequência correta.
     */
    if (ultimoRegistro) {
      const proximoEsperado =
        this.proximosRegistros[
          ultimoRegistro.tipo
        ];

      /*
       * Depois da saída,
       * o dia está encerrado.
       */
      if (
        ultimoRegistro.tipo === "saida"
      ) {
        throw new AppError(
          this.mensagensErro.diaEncerrado,
          400
        );
      }

      /*
       * Não permite duas entradas.
       */
      if (
        ultimoRegistro.tipo ===
          "entrada" &&
        tipo === "entrada"
      ) {
        throw new AppError(
          this.mensagensErro.entradaDuplicada,
          400
        );
      }

      /*
       * Verifica se o registro atual
       * é exatamente o próximo esperado.
       */
      if (
        tipo !== proximoEsperado
      ) {
        throw new AppError(
          this.mensagensErro.sequenciaInvalida,
          400
        );
      }
    }

    /*
     * Salva a data em formato ISO UTC.
     *
     * Exemplo:
     * 2026-08-19T02:25:30.123Z
     *
     * Isso evita problemas de interpretação
     * de datas pelo SQLite.
     */
    return RegistroModel.create({
      user_id: userId,
      tipo,
      data_hora:
        new Date().toISOString(),
    });
  }

  async meusRegistros(
    userId,
    filtros = {}
  ) {
    return RegistroModel.findByUserId(
      userId,
      filtros
    );
  }

  async findAllWithUsers(
    ceoId,
    incluirCeo = false
  ) {
    return RegistroModel.findAllWithUsers(
      ceoId,
      incluirCeo
    );
  }
}

module.exports =
  new RegistroService();