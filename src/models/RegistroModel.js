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
}

module.exports = new RegistroModel();