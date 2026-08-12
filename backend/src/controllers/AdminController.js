const RegistroService = require("../services/RegistroService");
const CalculoHorasService = require("../services/CalculoHorasService");
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

    const {
      data,
      mes,
      ano,
      inicio,
      fim,
    } = req.query;

    const registros =
      await RegistroService.meusRegistros(
        id,
        {
          data,
          mes,
          ano,
          inicio,
          fim,
        }
      );

    const registrosFormatados =
      registros.map((registro) => ({
        tipo: registro.tipo,
        data_hora: formatarDataRecife(
          registro.data_hora
        ),
      }));

    const calculos =
      CalculoHorasService
        .calcularHorasPorDia(
          registros
        );

    let resumoMensal = null;

    if (mes && ano) {
      resumoMensal =
        CalculoHorasService
          .calcularResumoMensal(
            calculos,
            mes,
            ano
          );
    }

    return res.status(200).json({
      registros: registrosFormatados,
      calculos,
      resumoMensal,
    });
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
