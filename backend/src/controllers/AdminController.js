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

      const { data, mes, ano, inicio, fim } = req.query;

      const usuario = await UserModel.findById(id);

      if (!usuario) {
        return res.status(404).json({
          message: "Usuário não encontrado.",
        });
      }

      /*
       * Descobre qual CEO representa
       * a conta do usuário autenticado.
       */
      const ceoIdLogado =
        req.user.cargo === "CEO" ? req.user.id : req.user.ceo_id;

      /*
       * Descobre a qual conta pertence
       * o usuário que está sendo consultado.
       */
      const ceoIdUsuario =
        usuario.cargo === "CEO" ? usuario.id : usuario.ceo_id;

      /*
       * Impede acesso entre contas.
       *
       * Exemplo:
       * CEO 1 nunca pode consultar
       * usuário pertencente ao CEO 2.
       */
      if (Number(ceoIdLogado) !== Number(ceoIdUsuario)) {
        return res.status(403).json({
          message: "Você não possui permissão para visualizar este usuário.",
        });
      }

      /*
       * Administrador pode visualizar
       * Administradores e Funcionários,
       * mas não o CEO.
       */
      if (req.user.cargo === "Administrador" && usuario.cargo === "CEO") {
        return res.status(403).json({
          message: "Você não possui permissão para visualizar este usuário.",
        });
      }

      const jornadaDiariaMinutos = usuario.jornada_diaria_minutos ?? 480;

      const registros = await RegistroService.meusRegistros(id, {
        data,
        mes,
        ano,
        inicio,
        fim,
      });

      const registrosFormatados = registros.map((registro) => ({
        tipo: registro.tipo,

        data_hora: formatarDataRecife(registro.data_hora),
      }));

      const calculos = CalculoHorasService.calcularHorasPorDia(
        registros,
        jornadaDiariaMinutos,
      );

      let resumoMensal = null;

      if (mes && ano) {
        resumoMensal = CalculoHorasService.calcularResumoMensal(
          calculos,
          mes,
          ano,
        );
      }

      return res.status(200).json({
        usuario: {
          id: usuario.id,

          nome: usuario.nome,

          email: usuario.email,

          cargo: usuario.cargo,

          jornada_diaria_minutos: jornadaDiariaMinutos,

          ativo: usuario.ativo,
        },

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
      /*
       * CEO usa o próprio ID.
       *
       * Administrador usa o ceo_id
       * ao qual pertence.
       */
      const ceoId = req.user.cargo === "CEO" ? req.user.id : req.user.ceo_id;

      /*
       * Busca SOMENTE usuários
       * cadastrados por esse CEO.
       *
       * O próprio CEO não entra,
       * porque seu ceo_id é null.
       */
      let usuarios = await UserModel.findByCeoId(ceoId);

      /*
       * Remove o próprio administrador
       * da listagem.
       *
       * Ele consulta o próprio histórico
       * pela área pessoal.
       */
      usuarios = usuarios.filter((usuario) => usuario.id !== req.user.id);

      return res.status(200).json(usuarios);
    } catch (error) {
      next(error);
    }
  }

  async registros(req, res, next) {
    try {
      /*
       * Identifica a conta atual.
       */
      const ceoId = req.user.cargo === "CEO" ? req.user.id : req.user.ceo_id;

      /*
       * Na próxima alteração,
       * RegistroService usará esse ceoId
       * para buscar somente os registros
       * dos usuários dessa conta.
       */
      const registros = await RegistroService.findAllWithUsers(ceoId);

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
