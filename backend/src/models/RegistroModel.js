const knex = require("../database/connection");

class RegistroModel {
  async create(registro) {
    return knex("registros").insert(registro);
  }

  async findByUserId(userId, filtros = {}) {
    const query = knex("registros").select("tipo", "data_hora").where({
      user_id: userId,
    });

    /*
     * FILTRO POR DIA
     *
     * Recife = UTC-3
     */
    if (filtros.data) {
      query.whereRaw("DATE(data_hora, '-3 hours') = ?", [filtros.data]);
    }

    /*
     * FILTRO POR MÊS E ANO
     */
    if (filtros.mes && filtros.ano) {
      const mesFormatado = String(filtros.mes).padStart(2, "0");

      const anoFormatado = String(filtros.ano);

      query
        .whereRaw("strftime('%m', data_hora, '-3 hours') = ?", [mesFormatado])
        .whereRaw("strftime('%Y', data_hora, '-3 hours') = ?", [anoFormatado]);
    }

    /*
     * FILTRO POR INTERVALO
     */
    if (filtros.inicio && filtros.fim) {
      query.whereRaw("DATE(data_hora, '-3 hours') BETWEEN ? AND ?", [
        filtros.inicio,
        filtros.fim,
      ]);
    }

    return query.orderBy("data_hora", "desc");
  }

  async findLastByUserToday(userId) {
    return knex("registros")
      .select("tipo", "data_hora")
      .where("user_id", userId)
      .whereRaw(
        `
        DATE(data_hora, '-3 hours')
        =
        DATE('now', '-3 hours')
        `,
      )
      .orderBy("data_hora", "desc")
      .first();
  }

  async findAllWithUsers(ceoId, incluirCeo = false) {
    const query = knex("registros")
      .join("users", "users.id", "registros.user_id")
      .select(
        "users.id as user_id",
        "users.ceo_id",
        "users.nome",
        "users.email",
        "users.cargo",
        "registros.tipo",
        "registros.data_hora",
      );

    /*
     * Se quem está consultando for CEO:
     *
     * - traz os usuários ligados a ele
     * - traz também os registros do próprio CEO
     */
    if (incluirCeo) {
      query.where(function () {
        this.where("users.ceo_id", ceoId).orWhere("users.id", ceoId);
      });
    } else {
      /*
       * Administrador:
       *
       * traz apenas Administradores
       * e Funcionários da mesma conta.
       *
       * Como o CEO possui ceo_id = null,
       * ele fica automaticamente de fora.
       */
      query.where("users.ceo_id", ceoId);
    }

    return query.orderBy("registros.data_hora", "desc");
  }
}

module.exports = new RegistroModel();
