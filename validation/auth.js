const { check } = require("express-validator");

const validator = [
  check("email", "email is required").isEmail(),
  check("password", "password must be 6 character long!").isLength({ min: 6 }),
];
module.exports = validator;
