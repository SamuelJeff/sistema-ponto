require("dotenv").config();

const baseConfig = {
  client: "sqlite3",

  connection: {
    filename:
      process.env.DATABASE_FILE ||
      "./src/database/database.sqlite",
  },

  useNullAsDefault: true,

  migrations: {
    directory: "./src/database/migrations",
  },

  pool: {
    afterCreate: (conn, done) => {
      conn.run(
        "PRAGMA foreign_keys = ON",
        (error) => {
          done(error, conn);
        }
      );
    },
  },
};

module.exports = {
  development: baseConfig,
  production: baseConfig,
};