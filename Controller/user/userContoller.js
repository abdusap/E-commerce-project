const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const customer = require("../../Model/customerModel");
const category = require("../../Model/categoryModel");
const product = require("../../Model/productModel");
const cart = require("../../Model/cartModal");
const mongoose = require("mongoose");

// Login page
const login = (req, res) => {
  try {
    res.render("../views/user/login.ejs", req.query);
  } catch (error) {
    console.log(error);
  }
};

// signup page
const signup = (req, res) => {
  try {
    if (req.session.tempOTP != false) {
      req.session.tempOTP = false;
    }
    res.render("../views/user/sign_up.ejs", req.query);
  } catch (error) {
    console.log(error);
  }
};

//User login verification
const userVerfication = async (req, res) => {
  try {
    let inputEmail = req.body.email;
    let inputPassword = req.body.password;
    let userFind = await customer.findOne({ email: inputEmail });
    if (userFind) {
      if (userFind.status == true) {
        const hashedCheck = await bcrypt.compare(
          inputPassword,
          userFind.password
        );
        if (hashedCheck == true) {
          res.redirect("/");
        } else {
          res.redirect("/login?wrong=Wrong Email or Password");
        }
      } else {
        res.redirect("/login?wrong=Your Account is Blocked");
      }
    } else {
      res.redirect("/login?wrong=Invalid User");
    }
  } catch (error) {
    console.log(error);
  }
};

// User Post register
{
  let newUserDetails;
  var userRegister = async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      newUserDetails = await new customer({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: hashedPassword,
      });
      const inputEmail = req.body.email;
      const inputNumber = req.body.mobile;
      const emailCheck = await customer.findOne({ email: inputEmail });
      const numberCheck = await customer.findOne({ mobile: inputNumber });
      if (emailCheck || numberCheck) {
        res.render("../views/user/sign_up.ejs", {
          wrong: "User already Exists",
        });
      } else {
        const tempOTP = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        console.log(tempOTP);
        req.session.tempOTP = tempOTP;

        // Transporter
        const transporter = await nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "sapabdu@gmail.com",
            pass: "nzltqjuxcqbkfgus",
          },
        });

        //Mail options
        const mailOptions = await {
          from: "sapabdu@gmail.com",
          to: inputEmail,
          subject: "OTP Verification",
          html: `<p>${tempOTP}</p>`,
        };

        // Send mail
        await transporter.sendMail(mailOptions);
        console.log("Account creation OTP Sent: " + req.session.tempOTP);
        res.redirect("/otp");
      }
    } catch (error) {
      console.log("Signup error: " + error);
    }
  };
}

// OTP Page
const otp = (req, res) => {
    try{
  if (req.session.tempOTP) {
    res.render("../views/user/otp.ejs");
  } else {
    res.redirect("/signup");
  }
}catch(error){
    console.log(error);
}
};

// OTP verification
const otpVerification = async (req, res) => {
    try{
  if (req.session.tempOTP) {
    if (req.session.tempOTP == req.body.otp) {
      console.log("Account creation OTP deleted: " + req.session.tempOTP);
      newUserDetails.save();
      req.session.tempOTP = false;
      res.redirect("/");
    } else {
      res.render("../views/user/otp.ejs", { wrong: "OTP incorrect" });
    }
  } else {
    res.redirect("/login");
  }
}catch(error){
    console.log(error);
}
};

let home = async (req, res) => {
  try {
    let brands = await product.distinct("brand");
    let categories = await category.find({ status: true });
    res.render("../views/user/home.ejs", { brands, categories });
  } catch (error) {
    console.log(error);
  }
};

let profile = async (req, res) => {
    try{
    let brands = await product.distinct("brand");
    let categories = await category.find({ status: true });
    let address = await customer.aggregate([
      { $match: { name: "ajmal" } },
      { $unwind: "$address" },
      {
        $project: {
          name: "$address.name",
          addressline1: "$address.addressline1",
          addressline2: "$address.addressline2",
          district: "$address.district",
          state: "$address.state",
          country: "$address.country",
          pin: "$address.pin",
          mobile: "$address.mobile",
          _id: "$address._id",
        },
      },
    ]);
    res.render("../views/user/userProfile.ejs", { brands, categories, address });
}catch(error){
    console.log(error);
}
  };

  let addressEdit = async (req, res) => {
    try {
      let email = "ajmal@gmail.com";
      let EditData = await customer.find(
        { email: email },
        { address: { $elemMatch: { _id: req.query.id } } }
      );
      
      let brands = await product.distinct("brand");
      let categories = await category.find({ status: true });
      res.render("../views/user/addressEdit.ejs", {
        brands,
        categories,
        EditData,
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  let addressDelete = async (req, res) => {
    try {
      let email = "ajmal@gmail.com";
      await customer.updateOne(
        { email: email },
        { $pull: { address: { _id: req.query.id } } }
      );
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  let addressAdd = async (req, res) => {
    try {
      let email = "ajmal@gmail.com";
      await customer.updateOne(
        { email: email },
        {
          $push: {
            address: {
              name: req.body.name,
              addressline1: req.body.addressline1,
              addressline2: req.body.addressline2,
              district: req.body.district,
              state: req.body.state,
              country: req.body.country,
              pin: req.body.pin,
              mobile: req.body.mobile,
            },
          },
        }
      );
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };


  module.exports = {
    login,
    signup,
    userVerfication,
    userRegister,
    otp,
    otpVerification,
    home,
    profile,
    addressEdit,
    addressDelete,
    addressAdd,
  };
