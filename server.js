const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");
const cors = require("cors");
const { getTotalUsers, signIn } = require("./controllers");
const { db } = require("./connection.js");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", getTotalUsers);
app.post("/signin", signIn);

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
