const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const validator = require("../validation/user");
const User = require("../models/User");
require("dotenv").config();
//@route   post /user/
//@desc    post user
//@acess   public
router.post("/", [validator], async (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ errors: [{ msg: "user already exists!!" }] });
    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    //creating user instance
    user = new User({
      name,
      email,
      password: hashpassword,
    });
    await user.save();
    const payload = {
      user: {
        id: user._id,
      },
    };
    jwt.sign({ payload }, process.env.jwtToken, (err, token) => {
      if (err) throw err;
      res.json({
        token,
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("internal server error");
  }
});
module.exports = router;
