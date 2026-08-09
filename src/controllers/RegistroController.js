const RegistroService = require("../services/RegistroService");
const { formatarDataRecife } = require("../utils/date");

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
  };

  async registrarPonto(req, res, next, tipo) {
    try {
      await RegistroService.registrarPonto(
        req.user.id,
        tipo
      );

      return res.status(201).json({
        message: this.mensagens.sucesso[tipo],
      });
    } catch (error) {
      next(error);
    }
  }

  async entrada(req, res, next) {
    return this.registrarPonto(
      req,
      res,
      next,
      "entrada"
    );
  }

  async inicioAlmoco(req, res, next) {
    return this.registrarPonto(
      req,
      res,
      next,
      "inicio_almoco"
    );
  }

  async fimAlmoco(req, res, next) {
    return this.registrarPonto(
      req,
      res,
      next,
      "fim_almoco"
    );
  }

  async saida(req, res, next) {
    return this.registrarPonto(
      req,
      res,
      next,
      "saida"
    );
  }

  async meusRegistros(req, res, next) {
    try {
      const {
        data,
        mes,
        ano,
        inicio,
        fim,
      } = req.query;

      const registros =
        await RegistroService.meusRegistros(
          req.user.id,
          {
            data,
            mes,
            ano,
            inicio,
            fim,
          }
        );

      const registrosFormatados = registros.map(
        (registro) => ({
          tipo: registro.tipo,
          data_hora: formatarDataRecife(
            registro.data_hora
          ),
        })
      );

      return res.status(200).json(registrosFormatados);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RegistroController();