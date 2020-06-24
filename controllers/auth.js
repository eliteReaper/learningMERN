const User = require("../models/user");
const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator/check");

exports.postLogin = (req, res, next) => {
  // console.log(req.body);
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.send(false);
        return;
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((result) => {
          if (!result) return;
          req.session.user = user;
          req.session.isLoggedIn = true;
          req.session.save((err) => {
            if (err) console.log("Session saving error occured: " + err);
            res.send("Login Success");
          });
        })
        .catch((err) => {
          console.log("didnt compare " + err);
        });
    })
    .catch((err) => {
      console.log("Didnt find user in auth file: " + err);
    });
};

exports.getLogin = (req, res, next) => {
  if (req.session.isLoggedIn) res.send({ isLoggedIn: true });
  else res.send({ isLoggedIn: false });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log("didnt logout User: " + err);
    res.send("User logged out");
  });
};

exports.postSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send("False");
    return;
  }
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        // console.log("FOUND");
        res.send("False");
        return;
      }
      bcrypt
        .hash(req.body.password, 12)
        .then((hashedPass) => {
          const data = {
            email: req.body.email,
            password: hashedPass,
            cart: { items: [] },
          };
          const newUser = new User(data);
          newUser
            .save()
            .then((result) => {
              res.end("True");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((errHash) => {
          console.log("didnt hash " + err);
        });
    })
    .catch((err) => {
      console.log("didnt signup : " + err);
    });
};
