require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/RegisterController");
const signin = require("./controllers/SigninController");
const profile = require("./controllers/ProfileController");
const image = require("./controllers/ImageController");

const {
  PG_HOST: host,
  PG_USER: user,
  PG_PASS: password,
  PG_DATABASE: database,
} = process.env;

const db = knex({
  client: "pg",
  connection: {
    host,
    user,
    password,
    database,
  },
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send(db.users);
});
app.post("/signin", signin.handleSignin(db, bcrypt));

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(3333, () => {
  console.log("app is running on port 3000");
});
