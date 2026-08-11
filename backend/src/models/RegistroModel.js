const knex = require("../database/connection");

class RegistroModel {
  async create(registro) {
    return knex("registros").insert(registro);
  }

  async findByUserId(userId, filtros = {}) {
    const query = knex("registros")
      .select("tipo", "data_hora")
      .where({ user_id: userId });

    // Filtro por dia
    if (filtros.data) {
      query.whereRaw(
        "DATE(data_hora AT TIME ZONE 'America/Recife') = ?",
        [filtros.data]
      );
    }

    // Filtro por mês e ano
    if (filtros.mes && filtros.ano) {
      query
        .whereRaw(
          "EXTRACT(MONTH FROM data_hora AT TIME ZONE 'America/Recife') = ?",
          [filtros.mes]
        )
        .whereRaw(
          "EXTRACT(YEAR FROM data_hora AT TIME ZONE 'America/Recife') = ?",
          [filtros.ano]
        );
    }

    // Filtro por intervalo
    if (filtros.inicio && filtros.fim) {
      query.whereRaw(
        "DATE(data_hora AT TIME ZONE 'America/Recife') BETWEEN ? AND ?",
        [filtros.inicio, filtros.fim]
      );
    }

    return query.orderBy("data_hora", "desc");
  }

  async findLastByUserToday(userId) {
    return knex("registros")
      .select("tipo", "data_hora")
      .where("user_id", userId)
      .whereRaw(
        "DATE(data_hora AT TIME ZONE 'America/Recife') = CURRENT_DATE"
      )
      .orderBy("data_hora", "desc")
      .first();
  }

  async findAllWithUsers() {
    return knex("registros")
      .join("users", "users.id", "registros.user_id")
      .select(
        "users.nome",
        "users.email",
        "users.cargo",
        "registros.tipo",
        "registros.data_hora"
      )
      .orderBy("registros.data_hora", "desc");
  }
}

module.exports = new RegistroModel();