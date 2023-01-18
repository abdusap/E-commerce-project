const admin = require("../../Model/adminModel");
const customers = require("../../Model/customerModel");
const products = require("../../Model/productModel");
const orders = require("../../Model/orderModel");

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
      req.session.admin = email;
      res.redirect("/admin/home");
    } else {
      res.redirect("/admin/login?wrong=Email or password Wrong");
    }
  } catch {
    res.redirect("/admin/login?wrong=invalid user");
  }
};

// Admin page
const home = async (req, res) => {
  try {
    const users = await customers.find().count();
    const productCount = await products.find().count();
    const totalOrder = await orders.find();
    const totalRevenue = totalOrder.reduce((acc, curr) => {
      acc = acc + curr.totalAmount;
      return acc;
    }, 0);
    const cancelOrder = await orders.find({ orderStatus: "cancelled" }).count();
    const delivered = await orders.find({ orderStatus: "delivered" }).count();
    const processing = await orders.find({ orderStatus: "processing" }).count();
    const shipped = await orders.find({ orderStatus: "shipped" }).count();
    res.render("../views/admin/home.ejs", {
      users,
      productCount,
      cancelOrder,
      totalRevenue,
      delivered,
      shipped,
      processing,
    });
  } catch (error) {
    console.log(error);
  }
};

const logout= async (req, res) => {
  try{
     req.session.destroy()
     console.log('session destroyed')
     res.redirect('/admin/login')
  }catch(error){
    console.log(error);
  }
}

module.exports = {
  home,
  adminLogin,
  adminVerification,
  logout
};
