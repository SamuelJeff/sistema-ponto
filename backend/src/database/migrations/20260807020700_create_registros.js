exports.up = function (knex) {
  return knex.schema.createTable("registros", function (table) {
    table.increments("id").primary();

    table.integer("user_id").unsigned().notNullable();

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("tipo").notNullable();

    table.timestamp("data_hora").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("registros");
};
