const {
  fetchTotalUsers,
  signingIn,
  registering,
  fetchProfileById,
  fetchEntries,
} = require("./models");

// exports.getTotalUsers = (req, res) => {
//   fetchTotalUsers()
//     .then((totalUser) => {
//       console.log("from controller", totalUser);
//       res.status(200).json(`${totalUser} user(s) registered`);
//     })
//     .catch((err) => res.status(400).json("something is not right"));
// };

exports.getTotalUsers = (req, res) => {
  fetchTotalUsers()
    .then((totalUser) => {
      res.status(200).json(totalUser);
    })
    .catch((err) => res.status(400).json("something is not right"));
};

exports.signIn = (req, res) => {
  const { email, password } = req.body;
  signingIn(email, password)
    .then((user) => {
      if (user.id) {
        res.status(200).json(user);
      } else {
        res.status(400).json(user);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something in the server gone wrong");
    });
};

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  registering(name, email, password)
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something in the server gone wrong");
    });
};

exports.getProfileById = (req, res) => {
  const { id } = req.params;
  fetchProfileById(id)
    .then((profile) => res.status(200).json(profile))
    .catch((err) => {
      res.status(err.status).json(err.msg);
    });
};

exports.incrementEntries = (req, res) => {
  const { id } = req.body;
  fetchEntries(id)
    .then((entries) => res.status(200).json(entries))
    .catch((err) => {
      res.status(err.status).json(err.msg);
    });
};
