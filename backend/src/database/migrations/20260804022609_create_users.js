exports.up = function (knex) {
  return knex.schema.createTable(
    "users",
    function (table) {
      table
        .increments("id")
        .primary();

      table
        .integer("ceo_id")
        .unsigned()
        .nullable();

      table
        .foreign("ceo_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");

      table
        .string("nome")
        .notNullable();

      table
        .string("nome_empresa")
        .nullable();

      table
        .string("email")
        .notNullable()
        .unique();

      table
        .string("senha")
        .notNullable();

      table
        .string("cargo")
        .notNullable();

      table
        .integer(
          "jornada_diaria_minutos"
        )
        .notNullable()
        .defaultTo(480);

      table
        .boolean("ativo")
        .notNullable()
        .defaultTo(true);

      table
        .string("status_assinatura")
        .nullable();

      table
        .timestamp("created_at")
        .defaultTo(
          knex.fn.now()
        );
    }
  );
};

exports.down = function (knex) {
  return knex.schema.dropTable(
    "users"
  );
};