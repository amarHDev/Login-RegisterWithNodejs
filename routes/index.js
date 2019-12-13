const express = require("express");

const router = express.Router();

const { isAuthenticated } = require("../config/auth");



//home page
router.get("/", (req, res) => {
  //res.send(" Home page");
  res.render('home');
});

// dashboard page
router.get("/dashboard", isAuthenticated, (req, res) => {
  //res.send(" Dashboard page");
  res.render('dashboard');
});

module.exports = router;
