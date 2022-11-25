const { db } = require("./connection.js");
const bcrypt = require("bcrypt-nodejs");

exports.fetchTotalUsers = () => {
  return db("users")
    .count("email")
    .then((data) => {
      return data[0].count;
    });
};

exports.signingIn = (email, password) => {
  return db
    .select("hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      if (data) {
        const isPasswordValid = bcrypt.compareSync(password, data[0].hash);
        if (isPasswordValid) {
          return db
            .select("*")
            .from("users")
            .where("email", "=", email)
            .then((user) => {
              return user[0];
            })
            .catch((err) => console.log(err));
        } else {
          return "Username and password doesn't match!";
        }
      }
    })
    .catch((err) => console.log(err));
};
