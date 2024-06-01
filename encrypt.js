const bcrypt = require("bcrypt");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const hash = async (pass) => {
  let password = await bcrypt.hash(pass, 10);

  console.log(password);
};

const isPassTrue = async (req) => {
  let isTrue = await bcrypt.compare(req.body.pass, process.env.ADMIN_PA);
  if (isTrue && req.body.ur == process.env.ADMIN_UR) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  isPassTrue,
};
