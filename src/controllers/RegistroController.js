const RegistroModel = require("../models/RegistroModel");

class RegistroController {
  constructor() {
    this.entrada = this.entrada.bind(this);
    this.inicioAlmoco = this.inicioAlmoco.bind(this);
    this.fimAlmoco = this.fimAlmoco.bind(this);
    this.saida = this.saida.bind(this);
    this.meusRegistros = this.meusRegistros.bind(this);
  }

  mensagens = {
    sucesso: {
      entrada: "Entrada registrada com sucesso.",
      inicio_almoco: "Início do almoço registrado com sucesso.",
      fim_almoco: "Fim do almoço registrado com sucesso.",
      saida: "Saída registrada com sucesso.",
    },

    erro: {
      primeiroRegistro: "O primeiro registro do dia deve ser uma entrada.",

      entradaDuplicada: "Você já registrou a entrada.",

      inicioAlmoco: "Você precisa registrar o início do almoço.",

      fimAlmoco: "Você precisa registrar o fim do almoço.",

      diaEncerrado: "O ponto deste dia já foi encerrado.",

      sequenciaInvalida: "A sequência de registros é inválida.",
    },
  };

  proximosRegistros = {
    entrada: "inicio_almoco",
    inicio_almoco: "fim_almoco",
    fim_almoco: "saida",
    saida: null,
  };

  async registrarPonto(req, res, tipo) {
    try {
      const ultimoRegistro = await RegistroModel.findLastByUserToday(
        req.user.id,
      );
      console.log("Último registro:", ultimoRegistro);
      // Primeiro registro do dia
      if (!ultimoRegistro && tipo !== "entrada") {
        return res.status(400).json({
          message: this.mensagens.erro.primeiroRegistro,
        });
      }

      // Já existe um registro hoje
      if (ultimoRegistro) {
        const proximoEsperado = this.proximosRegistros[ultimoRegistro.tipo];

        // O dia já foi encerrado
        if (ultimoRegistro.tipo === "saida") {
          return res.status(400).json({
            message: this.mensagens.erro.diaEncerrado,
          });
        }

        // Tentou registrar entrada novamente
        if (ultimoRegistro.tipo === "entrada" && tipo === "entrada") {
          return res.status(400).json({
            message: this.mensagens.erro.entradaDuplicada,
          });
        }

        // Qualquer sequência inválida
        if (tipo !== proximoEsperado) {
          return res.status(400).json({
            message: this.mensagens.erro.sequenciaInvalida,
          });
        }
      }

      await RegistroModel.create({
        user_id: req.user.id,
        tipo,
        data_hora: new Date(),
      });

      return res.status(201).json({
        message: this.mensagens.sucesso[tipo],
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor.",
      });
    }
  }

  async entrada(req, res) {
    return this.registrarPonto(req, res, "entrada");
  }

  async inicioAlmoco(req, res) {
    return this.registrarPonto(req, res, "inicio_almoco");
  }

  async fimAlmoco(req, res) {
    return this.registrarPonto(req, res, "fim_almoco");
  }

  async saida(req, res) {
    return this.registrarPonto(req, res, "saida");
  }

  async meusRegistros(req, res) {
    try {
      const { data, mes, ano, inicio, fim } = req.query;

      const registros = await RegistroModel.findByUserId(req.user.id, {
        data,
        mes,
        ano,
        inicio,
        fim,
      });

      return res.status(200).json(registros);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor.",
      });
    }
  }
}

module.exports = new RegistroController();
