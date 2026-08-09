const RegistroService = require("../services/RegistroService");
const UserModel = require("../models/UserModel");
const { formatarDataRecife } = require("../utils/date");

class AdminController {
  constructor() {
    this.registrosUsuario = this.registrosUsuario.bind(this);
    this.usuarios = this.usuarios.bind(this);
    this.registros = this.registros.bind(this);
  }

  async registrosUsuario(req, res, next) {
    try {
      const { id } = req.params;

      const registros = await RegistroService.meusRegistros(id);

      const registrosFormatados = registros.map((registro) => ({
        tipo: registro.tipo,
        data_hora: formatarDataRecife(registro.data_hora),
      }));

      return res.status(200).json(registrosFormatados);
    } catch (error) {
      next(error);
    }
  }

  async usuarios(req, res, next) {
    try {
      const usuarios = await UserModel.findAll();

      return res.status(200).json(usuarios);
    } catch (error) {
      next(error);
    }
  }

  async registros(req, res, next) {
    try {
      const registros = await RegistroService.findAllWithUsers();

      const registrosFormatados = registros.map((registro) => ({
        nome: registro.nome,
        email: registro.email,
        cargo: registro.cargo,
        tipo: registro.tipo,
        data_hora: formatarDataRecife(registro.data_hora),
      }));

      return res.status(200).json(registrosFormatados);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();