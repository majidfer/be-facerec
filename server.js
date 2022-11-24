const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());
// app.use(express.json());

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "feri",
    password: "mysecretword123",
    database: "facerec",
  },
});

const database = {
  users: [
    {
      id: "123",
      name: "feri",
      email: "ferialfahri@gmail.com",
      password: "heroku",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "ayu",
      email: "ayu@gmail.com",
      password: "supersekali",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  // res.send(database.users);
  db.select("*")
    .from("users")
    .then((users) => {
      res.send(users);
    });
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  const validEmail = email === database.users[0].email;
  // const validPass = bcrypt.compareSync(password, database.users[2].password);
  const validPass = password === database.users[0].password;

  validEmail && validPass
    ? res.json(database.users[0])
    : res.status(400).json("error in signing in");
});

app.post("/register", (req, res) => {
  const { name, email } = req.body;
  db("users")
    .returning("*")
    .insert({
      name: name,
      email: email,
      joined: new Date(),
    })
    .then((response) => {
      if (response) {
        res.json(response[0]);
      }
    })
    .catch((error) => res.status(400).json("registering error"));
});

app.post("/profile/:id", (req, res) => {
  const { id } = req.params;
  const user = database.users.filter((user) => user.id === id);
  if (user.length !== 0) {
    res.send(user[0]);
  } else {
    res.send("user not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  const user = database.users.filter((user) => user.id === id);
  if (user.length !== 0) {
    user[0].entries++;
    res.json(user[0].entries);
  } else {
    res.json("some error occured");
  }
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
