const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "IamAlwaysaHero";
router.post(
  "/createuser",
  body("email", "Enter a valid email").isEmail(),
  body("name", "Name must be atleast 3 characters long").isLength({ min: 3 }),
  body("password", "Password must be atleast 5 characters long").isLength({
    min: 5,
  }),
  async (req, res) => {
    let success = false;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
      }
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({success, error: "Email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      let secPass = await bcrypt.hash(req.body.password, salt);
      user = User.create({
        email: req.body.email,
        password: secPass,
        name: req.body.name,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken });
    } catch (error) {
      res.status(500).json({
        success,
        error: error,
        message: "Internal Server Error",
      });
    }
  }
);

router.post(
  "/login",
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password field can't be blank").exists(),
  async (req, res) => {
    let success = false;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
      }
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({success, error: "Invalid login credentials"});
      }
      let passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({success, error: "Invalid login credentials"});
      }
      const data = {
        user: {
          id: user.id,
        }
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      res.status(500).json({
        error: error,
        message: "Internal Server Error",
      });
    }
  }
);
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).json({
      error: error,
      message: "Internal Server Error",
    });
  }
});
module.exports = router;
