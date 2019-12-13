const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

//login form
router.get("/login", (req, res) => {
  res.render("login");
});

//login user request

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

// register page
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { email, password, password2 } = req.body;
  //validation

  let errors = [];
  if (!email || !password || !password2) {

    errors.push({
      msg: "please enter all feilds"
    });
  }
  if (password !== password2) {
    errors.push({
      msg: "password does not match"
    });
  }

  if (password.length < 3) {
    errors.push({
      msg: "password must be more than 3 characteres"
    });
  }

  if (errors.length > 0) {
    res.render("register", { errors });
  } else {
    //validationis ok
    // check if user is exist or not
    User.findOne({
      where: {
        email: email
      }
    })
      .then(user => {
        if (user) {
          errors.push({
            msg: "email was already used"
          });
          res.render("register", { errors });
        } else {
          //create user

          const newUser = new User({
            email,
            password
          });
          //hash the password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  console.log("user created");
                  req.flash(
                    "successMessage",
                    " your account is created ,please login"
                  );
                  res.redirect("/users/login");
                })
                .catch(err => {
                  console.log(err);
                  req.flash("ErrorMessage", "There an error");
                  res.redirect("/users/register");
                }); //end new user
            });
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
});



// logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;
