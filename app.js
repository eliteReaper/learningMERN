const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mondoDBStore = require("connect-mongodb-session")(session);

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

const app = express();
const Store = new mondoDBStore({
  uri:
    "mongodb+srv://parthapaul:<RemovePassword>@libraryforfools.umfgz.mongodb.net/shop",
  collection: "sessions",
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: "Content-Type",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(
  session({
    name: "app.sid",
    secret: "mySecretForSomething",
    resave: false,
    saveUninitialized: false,
    store: Store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use("/shop", shopRoutes);
app.use(authRoutes);

app.use((req, res, next) => {
  res.status(404).send("404 Page");
});

mongoose
  .connect(
    "mongodb+srv://parthapaul:<RemovingPassword>@libraryforfools.umfgz.mongodb.net/shop?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then((res) => {
    console.log("Connected to Database");
    app.listen(3001);
  })
  .catch((err) => {
    console.log(err);
  });
