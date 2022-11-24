const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "feri",
    password: "mysecretword123",
    database: "facerec",
  },
});

app.get("/", (req, res) => {
  db("users")
    .count("email")
    .then((data) => res.json(`${data[0].count} user(s) registered`));
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  db.select("hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      if (data) {
        const isPasswordValid = bcrypt.compareSync(password, data[0].hash);
        if (isPasswordValid) {
          db.select("*")
            .from("users")
            .where("email", "=", email)
            .then((user) => res.json(user[0]));
        } else {
          res.status(400).json("Username and password doesn't match!");
        }
      }
    })
    .catch((err) => {
      res.status(400).json("Error signing in");
    });

  // const validEmail = email === database.users[0].email;
  // // const validPass = bcrypt.compareSync(password, database.users[2].password);
  // const validPass = password === database.users[0].password;

  // validEmail && validPass
  //   ? res.json(database.users[0])
  //   : res.status(400).json("error in signing in");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    return trx
      .insert({ email: email, hash: hash })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .insert({
            name: name,
            email: loginEmail[0].email,
            joined: new Date(),
          })
          .returning("*")
          .then((user) => {
            if (user) {
              res.json(user[0]);
            } else {
              res.status(400).json("unable to register");
            }
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));
});

app.post("/profile/:id", (req, res) => {
  const { id } = req.params;
  db("users")
    .select("*")
    .where("id", id)
    .then((user) => {
      if (user.length > 0) {
        res.json(user[0]);
      } else {
        res.json("no user found");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => {
      res.status(400).json("some error occured");
    });
});

app.listen(3000, () => {
  console.log(`Server is up and listening on port 3000`);
});

/*
/ --> res = halo dari server
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/
