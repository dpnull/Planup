const bcrypt = require("bcryptjs");
const User = require("../models/User");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // new user instance
    user = new User({
      username,
      email,
      password, // we will hash it in the pre-middleware phase
    });

    await user.save();

    // we will use jwt for token generation
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "yourSecretKey", // never changed it
      { expiresIn: 3600 }, // token length
      (err, token) => {
        if (err) throw err;
        res.json({ msg: "User registered successfully", token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  // destructure email and password from request body
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // using bcrypt for password hashing
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // define the payload
    const payload = {
      userId: user._id,
    };

    // generate the token with a secret key and set an expiration
    const token = jwt.sign(payload, process.env.JWT_SECRET || "yourSecretKey", {
      expiresIn: "1h",
    });

    // respond with the token and user details
    res.json({ msg: "Logged in successfully", userId: user._id, token: token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
