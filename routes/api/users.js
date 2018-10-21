const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

//Import User Model
const User = require("../../models/User");

// @route   GET api/users
// @desc    Gets all users
// @access  Public
router.get("/", (req, res) => res.json({ msg: "Users works!" }));

// @route   POST api/register
// @desc    Register new user
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exist" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" //default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      //Hash the password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   POST api/login
// @desc    Login user and generates JWT token
// @access  Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Check user exists
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    //Compare password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //Payload
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        //Sign method
        jwt.sign(payload, keys.jwtSecret, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;

          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
