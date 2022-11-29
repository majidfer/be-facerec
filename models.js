const { db } = require("./connection.js");
const bcrypt = require("bcrypt-nodejs");

// exports.fetchTotalUsers = () => {
//   return db("users")
//     .count("email")
//     .then((data) => {
//       return data[0].count;
//     });
// };

exports.fetchTotalUsers = () => {
  return db("users")
    .returning("*")
    .select("*")
    .then((data) => {
      return data;
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
            });
        } else {
          return "Username and password doesn't match!";
        }
      }
    });
  // .catch((err) => console.log(err));
};

exports.registering = (name, email, password) => {
  const hash = bcrypt.hashSync(password);
  return db.transaction((trx) => {
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
              return user[0];
            }
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
};

exports.fetchProfileById = (id) => {
  return db("users")
    .select("*")
    .where("id", id)
    .then((user) => {
      if (user.length > 0) {
        return user[0];
      } else {
        return Promise.reject({
          status: 400,
          msg: "No user found",
        });
      }
    });
};

exports.fetchEntries = (id) => {
  return db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      if (entries.length > 0) {
        return entries[0].entries;
      } else {
        return Promise.reject({
          status: 404,
          msg: "User not found",
        });
      }
    })
    .catch((err) => {
      return Promise.reject({
        status: 500,
        msg: "Something's not right",
      });
    });
};
