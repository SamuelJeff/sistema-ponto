require("dotenv").config();

module.exports = {
  development: {
    client: "sqlite3",

    connection: {
      filename:
        process.env.DATABASE_FILE ||
        "./src/database/database.sqlite",
    },

    useNullAsDefault: true,

    migrations: {
      directory:
        "./src/database/migrations",
    },
  },
};