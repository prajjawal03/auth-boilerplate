const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const validator = require("../validation/auth");
const auth = require("../middleware/auth");
const User = require("../models/User");
require("dotenv").config();
//@route   post /auth/
//@desc    login user
//@acess   public
router.post("/", [validator], async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status().json({ errors: [{ msg: "invalid credentials" }] });
    //password checking
    const pass = await bcrypt.compare(password, user.password);
    if (!pass)
      return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });

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
    res.status(500).send("server error");
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.message(err.mesage);
    res.status(500).json({ msg: "internal server error" });
  }
});
module.exports = router;
