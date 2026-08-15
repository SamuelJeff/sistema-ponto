const RegistroService = require("../services/RegistroService");
const CalculoHorasService = require("../services/CalculoHorasService");
const UserModel = require("../models/UserModel");

const {
  formatarDataRecife,
} = require("../utils/date");

class AdminController {
  constructor() {
    this.registrosUsuario =
      this.registrosUsuario.bind(this);

    this.usuarios =
      this.usuarios.bind(this);

    this.registros =
      this.registros.bind(this);
  }

  async registrosUsuario(
    req,
    res,
    next
  ) {
    try {
      const { id } = req.params;

      const {
        data,
        mes,
        ano,
        inicio,
        fim,
      } = req.query;

      /*
       * Busca o usuário cujo histórico
       * o administrador está consultando.
       */
      const usuario =
        await UserModel.findById(id);

      if (!usuario) {
        return res.status(404).json({
          message:
            "Usuário não encontrado.",
        });
      }

      /*
       * Jornada do próprio funcionário.
       * 480 minutos = 8 horas.
       */
      const jornadaDiariaMinutos =
        usuario.jornada_diaria_minutos ??
        480;

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
        registros.map(
          (registro) => ({
            tipo:
              registro.tipo,

            data_hora:
              formatarDataRecife(
                registro.data_hora
              ),
          })
        );

      /*
       * Passamos a jornada do funcionário
       * para o cálculo.
       */
      const calculos =
        CalculoHorasService
          .calcularHorasPorDia(
            registros,
            jornadaDiariaMinutos
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
        usuario: {
          id:
            usuario.id,

          nome:
            usuario.nome,

          email:
            usuario.email,

          cargo:
            usuario.cargo,

          jornada_diaria_minutos:
            jornadaDiariaMinutos,
        },

        registros:
          registrosFormatados,

        calculos,

        resumoMensal,
      });
    } catch (error) {
      next(error);
    }
  }

  async usuarios(req, res, next) {
    try {
      const usuarios =
        await UserModel.findAll();

      return res
        .status(200)
        .json(usuarios);
    } catch (error) {
      next(error);
    }
  }

  async registros(req, res, next) {
    try {
      const registros =
        await RegistroService
          .findAllWithUsers();

      const registrosFormatados =
        registros.map(
          (registro) => ({
            nome:
              registro.nome,

            email:
              registro.email,

            cargo:
              registro.cargo,

            tipo:
              registro.tipo,

            data_hora:
              formatarDataRecife(
                registro.data_hora
              ),
          })
        );

      return res
        .status(200)
        .json(
          registrosFormatados
        );
    } catch (error) {
      next(error);
    }
  }
}

module.exports =
  new AdminController();