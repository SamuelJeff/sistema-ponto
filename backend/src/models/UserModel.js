const knex = require("../database/connection");

class UserModel {
  async findByEmail(email) {
    return knex("users")
      .where({ email })
      .first();
  }

  async findById(id) {
    return knex("users")
      .where({ id })
      .first();
  }

  async create(user) {
    return knex("users")
      .insert(user);
  }

  async findByCeoId(ceoId) {
    return knex("users")
      .select(
        "id",
        "ceo_id",
        "nome",
        "email",
        "cargo",
        "jornada_diaria_minutos",
        "ativo",
        "created_at"
      )
      .where("ceo_id", ceoId)
      .orderBy("id", "asc");
  }

  async findAll() {
    return knex("users")
      .select(
        "id",
        "ceo_id",
        "nome",
        "nome_empresa",
        "email",
        "cargo",
        "jornada_diaria_minutos",
        "ativo",
        "status_assinatura",
        "created_at"
      )
      .orderBy("id", "asc");
  }

  async updateStatus(id, ativo) {
    return knex("users")
      .where({ id })
      .update({
        ativo,
      });
  }
}

module.exports = new UserModel();