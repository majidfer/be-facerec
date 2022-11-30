const knex = require("knex");
const dotenv = require("dotenv");

const ENV = process.env.NODE_ENV || "development";

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

dotenv.config();
const { PGUSER, PGPASSWORD, PGDATABASE, DATABASE_URL } = process.env;

exports.db = knex({
  client: "pg",
  connection: {
    connectionString: DATABASE_URL,
    ssl: true,
  },
});
