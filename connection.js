const knex = require("knex");
const dotenv = require("dotenv");

const ENV = process.env.NODE_ENV || "development";

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config =
  ENV === "production" ? { connectionString: process.env.DATABASE_URL } : {};

dotenv.config();
const { PGUSER, PGPASSWORD, PGDATABASE } = process.env;

exports.db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
  },
});
