const knex = require("../database/connection");

class RegistroModel {
  async create(registro) {
    return knex("registros").insert(registro);
  }

  async findByUserId(userId) {
    return knex("registros")
      .select("tipo", "data_hora")
      .where({ user_id: userId })
      .orderBy("data_hora", "desc");
  }
}

module.exports = new RegistroModel();
