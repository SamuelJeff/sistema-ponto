/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("registros", (table) => {

    table.increments("id").primary();

    table
      .integer("user_id")
      .unsigned()
      .notNullable();

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .enu("tipo", [
        "entrada",
        "inicio_almoco",
        "fim_almoco",
        "saida"
      ])
      .notNullable();

    table
      .timestamp("data_hora")
      .notNullable();

    table
      .timestamp("created_at")
      .defaultTo(knex.fn.now());

  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("registros");
};
