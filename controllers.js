const { fetchTotalUsers, signingIn } = require("./models");

exports.getTotalUsers = (req, res) => {
  fetchTotalUsers()
    .then((totalUser) => {
      res.status(200).json(`${totalUser} user(s) registered`);
    })
    .catch((err) => res.status(400).json("something is not right"));
};

exports.signIn = (req, res) => {
  const { email, password } = req.body;
  signingIn(email, password)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(400).json("Error signing in");
    });
};
