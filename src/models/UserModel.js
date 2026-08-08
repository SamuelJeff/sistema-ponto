const knex = require("../database/connection");

class UserModel {
  async findByEmail(email) {
    return knex("users").where({ email }).first();
  }
  async findById(id) {
    return knex("users").where({ id }).first();
  }
  async create(user) {
    return knex("users").insert(user);
  }
  async findAll() {
    return knex("users")
      .select("id", "nome", "email", "cargo")
      .orderBy("id", "asc");
  }
}

module.exports = new UserModel();
