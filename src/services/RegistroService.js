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
      await RegistroModel.findLastByUserToday(userId);

    // Primeiro registro do dia
    if (!ultimoRegistro && tipo !== "entrada") {
      throw new AppError(
        this.mensagensErro.primeiroRegistro,
        400
      );
    }

    // Já existe registro hoje
    if (ultimoRegistro) {
      const proximoEsperado =
        this.proximosRegistros[ultimoRegistro.tipo];

      // Dia encerrado
      if (ultimoRegistro.tipo === "saida") {
        throw new AppError(
          this.mensagensErro.diaEncerrado,
          400
        );
      }

      // Entrada duplicada
      if (
        ultimoRegistro.tipo === "entrada" &&
        tipo === "entrada"
      ) {
        throw new AppError(
          this.mensagensErro.entradaDuplicada,
          400
        );
      }

      // Sequência inválida
      if (tipo !== proximoEsperado) {
        throw new AppError(
          this.mensagensErro.sequenciaInvalida,
          400
        );
      }
    }

    return RegistroModel.create({
      user_id: userId,
      tipo,
      data_hora: new Date(),
    });
  }

  async meusRegistros(userId, filtros = {}) {
    return RegistroModel.findByUserId(userId, filtros);
  }

  async findAllWithUsers() {
  return RegistroModel.findAllWithUsers();
}

}

module.exports = new RegistroService();