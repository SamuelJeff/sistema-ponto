const knex = require("knex");
const knexConfig = require("../../knexfile");

const connection =
  knex(knexConfig.development);

connection.raw(
  "PRAGMA foreign_keys = ON"
);

module.exports = connection;