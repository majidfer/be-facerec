const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
// app.use(express.json());

const database = {
  users: [
    {
      id: "123",
      name: "feri",
      email: "feri@gmail.com",
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
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.send("signing in");
  } else {
    res.send("error on signing in");
  }
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.post("/profile/:id", (req, res) => {
  const { id } = req.params;
  const user = database.users.filter(user => user.id === id);
  if (user.length !== 0) {
    res.send(user[0]);
  } else {
    res.send("user not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  const user = database.users.filter(user => user.id === id);
  if (user.length !== 0) {
    user[0].entries++;
    res.json(user[0].entries);
  } else {
    res.json("some error occured");
  }
})

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
