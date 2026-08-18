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
    primeiroRegistro: "O primeiro registro do dia deve ser uma entrada.",

    entradaDuplicada: "Você já registrou a entrada.",

    diaEncerrado: "O ponto deste dia já foi encerrado.",

    sequenciaInvalida: "A sequência de registros é inválida.",
  };

  async registrarPonto(userId, tipo) {
    const ultimoRegistro = await RegistroModel.findLastByUserToday(userId);

    if (!ultimoRegistro && tipo !== "entrada") {
      throw new AppError(this.mensagensErro.primeiroRegistro, 400);
    }

    if (ultimoRegistro) {
      const proximoEsperado = this.proximosRegistros[ultimoRegistro.tipo];

      if (ultimoRegistro.tipo === "saida") {
        throw new AppError(this.mensagensErro.diaEncerrado, 400);
      }

      if (ultimoRegistro.tipo === "entrada" && tipo === "entrada") {
        throw new AppError(this.mensagensErro.entradaDuplicada, 400);
      }

      if (tipo !== proximoEsperado) {
        throw new AppError(this.mensagensErro.sequenciaInvalida, 400);
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

  async findAllWithUsers(ceoId) {
    return RegistroModel.findAllWithUsers(ceoId);
  }
}

module.exports = new RegistroService();
