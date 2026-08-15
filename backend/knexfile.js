// Update with your config settings.
require("dotenv").config();

module.exports = {
  development: {
    client: "sqlite3",

    connection: {
      filename:
        "./src/database/database.sqlite",
    },

    useNullAsDefault: true,

    migrations: {
      directory:
        "./src/database/migrations",
    },
  },
};
