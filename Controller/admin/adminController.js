const admin = require("../../Model/adminModel");
const customers=require("../../Model/customerModel")
const products=require("../../Model/productModel")
const orders=require("../../Model/orderModel")

const mongoose = require("mongoose");
const { order } = require("paypal-rest-sdk");


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
const home =async (req, res) => {
    try {
const users=await customers.find().count()
const productCount=await products.find().count()
const totalOrder=await orders.find()
const totalRevenue=totalOrder.reduce((acc,curr)=>{
  acc=acc+curr.totalAmount
  return acc
},0)
const cancelOrder=await orders.find({orderStatus:"cancelled"}).count()
// console.log(cancelOrder);
      res.render("../views/admin/home.ejs",{users,productCount,cancelOrder,totalRevenue});
    } catch (error) {
      console.log(error);
    }
  };

  module.exports = {
    home,
    adminLogin,
    adminVerification,
  };