const knex = require("../database/connection");

class RegistroModel {
  async create(registro) {
    return knex("registros").insert(registro);
  }

  async findByUserId(
    userId,
    filtros = {}
  ) {
    const query = knex("registros")
      .select(
        "tipo",
        "data_hora"
      )
      .where({
        user_id: userId,
      });

    /*
     * FILTRO POR DIA
     *
     * Recife = UTC-3
     *
     * Exemplo:
     * 2026-08-15
     */
    if (filtros.data) {
      query.whereRaw(
        "DATE(data_hora, '-3 hours') = ?",
        [filtros.data]
      );
    }

    /*
     * FILTRO POR MÊS E ANO
     *
     * SQLite usa strftime.
     *
     * %m = mês
     * %Y = ano
     */
    if (
      filtros.mes &&
      filtros.ano
    ) {
      const mesFormatado =
        String(
          filtros.mes
        ).padStart(
          2,
          "0"
        );

      const anoFormatado =
        String(
          filtros.ano
        );

      query
        .whereRaw(
          "strftime('%m', data_hora, '-3 hours') = ?",
          [mesFormatado]
        )
        .whereRaw(
          "strftime('%Y', data_hora, '-3 hours') = ?",
          [anoFormatado]
        );
    }

    /*
     * FILTRO POR INTERVALO
     */
    if (
      filtros.inicio &&
      filtros.fim
    ) {
      query.whereRaw(
        "DATE(data_hora, '-3 hours') BETWEEN ? AND ?",
        [
          filtros.inicio,
          filtros.fim,
        ]
      );
    }

    return query.orderBy(
      "data_hora",
      "desc"
    );
  }

  async findLastByUserToday(
    userId
  ) {
    return knex("registros")
      .select(
        "tipo",
        "data_hora"
      )
      .where(
        "user_id",
        userId
      )
      .whereRaw(
        `
        DATE(data_hora, '-3 hours')
        =
        DATE('now', '-3 hours')
        `
      )
      .orderBy(
        "data_hora",
        "desc"
      )
      .first();
  }

  async findAllWithUsers() {
    return knex("registros")
      .join(
        "users",
        "users.id",
        "registros.user_id"
      )
      .select(
        "users.nome",
        "users.email",
        "users.cargo",
        "registros.tipo",
        "registros.data_hora"
      )
      .orderBy(
        "registros.data_hora",
        "desc"
      );
  }
}

module.exports =
  new RegistroModel();