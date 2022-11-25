const knex = require("knex");
const dotenv = require("dotenv");

dotenv.config();
const {PGUSER, PGPASSWORD, PGDATABASE} = process.env;

exports.db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
  },
});
