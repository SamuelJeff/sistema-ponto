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
    entrada: "Entrada registrada com sucesso.",
    inicio_almoco: "Início do almoço registrado com sucesso.",
    fim_almoco: "Fim do almoço registrado com sucesso.",
    saida: "Saída registrada com sucesso.",
  };

  async registrarPonto(req, res, tipo) {
    try {
      await RegistroModel.create({
        user_id: req.user.id,
        tipo,
        data_hora: new Date(),
      });
      return res.status(201).json({
        message: this.mensagens[tipo],
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
      const registros = await RegistroModel.findByUserId(req.user.id);

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
