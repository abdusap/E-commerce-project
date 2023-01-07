const admin = require("../../Model/adminModel");
const mongoose = require("mongoose");


// Admin login page
const adminLogin = (req, res) => {
    try {
      res.render("../views/admin/login.ejs", req.query);
    } catch (error) {
      console.log(error);
    }
  };

  //Admin login verfication
const adminVerification = async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const adminAccount = await admin.findOne({ email: email });
      if (email == adminAccount.email && password == adminAccount.password) {
        req.session.admin=email
        res.redirect("/admin/home");
      } else {
        res.redirect("/admin/login?wrong=Email or password Wrong");
      }
    } catch {
      res.redirect("/admin/login?wrong=invalid user");
    }
  };

  // Admin page
const home = (req, res) => {
    try {
      res.render("../views/admin/home.ejs");
    } catch (error) {
      console.log(error);
    }
  };

  module.exports = {
    home,
    adminLogin,
    adminVerification,
  };