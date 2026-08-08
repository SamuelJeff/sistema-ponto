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
      query.whereRaw("DATE(data_hora) = ?", [filtros.data]);
    }

    // Filtro por mês e ano
    if (filtros.mes && filtros.ano) {
      query
        .whereRaw("EXTRACT(MONTH FROM data_hora) = ?", [filtros.mes])
        .whereRaw("EXTRACT(YEAR FROM data_hora) = ?", [filtros.ano]);
    }

    // Filtro por intervalo
    if (filtros.inicio && filtros.fim) {
      query.whereBetween("data_hora", [
        `${filtros.inicio} 00:00:00`,
        `${filtros.fim} 23:59:59`,
      ]);
    }

    return query.orderBy("data_hora", "desc");
  }

  async findLastByUserToday(userId) {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    const dataHoje = `${ano}-${mes}-${dia}`;
    console.log(dataHoje);
    return knex("registros")
      .select("tipo", "data_hora")
      .where({ user_id: userId })
      .whereRaw("DATE(data_hora) = ?", [dataHoje])
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
        "registros.data_hora",
      )
      .orderBy("registros.data_hora", "desc");
  }
}

module.exports = new RegistroModel();
