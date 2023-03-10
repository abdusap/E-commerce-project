const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const customer = require("../../Model/customerModel");
const category = require("../../Model/categoryModel");
const product = require("../../Model/productModel");
const cart = require("../../Model/cartModal");
const orders = require("../../Model/orderModel");
const banner = require("../../Model/bannerModel");
const mongoose = require("mongoose");
const { findOne } = require("../../Model/customerModel");
const wishlist = require("../../Model/wishlistModel");
require('dotenv').config()

// Login page
const login = (req, res) => {
  try {
    res.render("../views/user/login.ejs", req.query);
  } catch (error) {
    console.log(error);
    res.redirect('/500')
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
    res.redirect('/500')
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
          req.session.user=userFind._id

          res.json({success:true});
        } else {
          res.json({wrong:'Wrong Email or Password'})
          
        }
      } else {
        res.json({wrong:'Your Account is Blocked'})   
      }
    } else {
      res.json({wrong:'Invalid User'})    
    }
  } catch (error) {
    console.log(error);
    res.redirect('/500')
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
        res.json({wrong:'User already Exists'})
        // res.render("../views/user/sign_up.ejs", {
        //   wrong: "User already Exists",
        // });
      } else {
        const tempOTP = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        req.session.tempOTP = tempOTP;

        // Transporter
        const transporter = await nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });

        //Mail options
        const mailOptions = await {
          from: process.env.EMAIL,
          to: inputEmail ,
          subject: "OTP Verification",
          html: `<p>your OTP verification code is :${tempOTP}</p>`,
        };

        // Send mail
        await transporter.sendMail(mailOptions)
        console.log("Account creation OTP Sent: " + req.session.tempOTP)
        res.json({success:true})
        // res.redirect("/otp")
      }
    } catch (error) {
      console.log("Signup error: " + error);
      res.redirect('/500')
    }
  };

 // OTP verification
var otpVerification = async (req, res) => {
  try{

  if (req.session.tempOTP == req.body.otp) {
    console.log("Account creation OTP deleted: " + req.session.tempOTP);
    newUserDetails.save();
    req.session.tempOTP = false;
    res.json({success:'Account successfully created! Please login.'})
    // res.redirect("/login");
  } else {
    res.json({wrong:'OTP incorrect'})
    // res.render("../views/user/otp.ejs", { wrong: "OTP incorrect" });
  }

}catch(error){
  console.log(error);
  res.redirect('/500')
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
    res.redirect('/500')
}
};



const home = async (req, res) => {
  try {
    const brands = await product.distinct("brand");
    const categories = await category.find({ status: true });
    const user=await customer.findOne({_id: req.session.user})
    const bannerData=await banner.find({ status: true})
    const cartCount=await cart.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    const wishCount=await wishlist.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    const productData=await product.find().limit(10);
    res.render("../views/user/home.ejs", { brands, categories ,user,bannerData,cartCount,wishCount,productData});
  } catch (error) {
    console.log(error);
    res.redirect('/500')
  }
};

const profile = async (req, res) => {
    try{
      const userDetails=await customer.findById({_id:req.session.user})
      const brands = await product.distinct("brand");
      const categories = await category.find({ status: true });
      const user=await customer.findOne({_id: req.session.user})
      const cartCount=await cart.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    const wishCount=await wishlist.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
      const address = await customer.aggregate([
      { $match: { _id : mongoose.Types.ObjectId(req.session.user)} },
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
          status:"$address.status"
        },
      },
      {
        $sort: { status: -1 }
     }
    ]);
    const wrong=req.query.wrong
    const success=req.query.success
    res.render("../views/user/userProfile.ejs", { brands, categories, address  ,user,userDetails,wrong,success,wishCount,cartCount});
}catch(error){
    console.log(error);
    res.redirect('/500')
}
  };

{
let id
  var addressEdit = async (req, res) => {
    try {
       id=req.query.id
       const EditData = await customer.find(
        { _id : req.session.user },
        { address: { $elemMatch: { _id: req.query.id } } }
      );
      
      const brands = await product.distinct("brand");
      const categories = await category.find({ status: true });
      const user=await customer.findOne({_id: req.session.user})
      const cartCount=await cart.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    const wishCount=await wishlist.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
      res.render("../views/user/addressEdit.ejs", {
        brands,
        categories,
        EditData,
        user,
        cartCount,
        wishCount
      });
    } catch (error) {
      console.log(error);
      res.redirect('/500')
    }
  };

  var postAddressEdit= async (req,res)=>{
   await customer.updateOne(
      {_id : req.session.user , 'address._id': id },
      { $set: { 
        'address.$.name': req.body.name,
        'address.$.addressline1': req.body.addressline1,
        'address.$.addressline2' : req.body.addressline2,
        'address.$.district' : req.body.district,
        'address.$.state' : req.body.state,
        'address.$.country' : req.body.country,
        'address.$.pin' : req.body.pin,
        'address.$.mobile' : req.body.mobile,
     } },
    );
    res.redirect('/profile')
  }
}
  let addressDelete = async (req, res) => {
    try {
      await customer.updateOne(
        { _id : req.session.user },
        { $pull: { address: { _id: req.query.id } } }
      );
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
      res.redirect('/500')
    }
  };

  let addressAdd = async (req, res) => {
    try {
      await customer.updateOne(
        { _id: req.session.user },
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
        },
        { upsert: true }
      );
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
      res.redirect('/500')
    }
  };

  const addressDefualt=async (req,res)=>{
    try{
    const id =req.query.id
    await customer.updateMany(
      {_id:   mongoose.Types.ObjectId(req.session.user)},
      { $set: { "address.$[elem].status": false } },
      { arrayFilters: [ { "elem.status": true } ] }
    ) 
    await customer.updateOne(
      { _id: req.session.user, "address._id": id },
      { $set: { "address.$.status": true } }
     )
     res.redirect('/profile')
    }catch(error){
      console.log(error);
      res.redirect('/500')
    }
   }
   
   const profileEdit=async (req,res)=>{
  try{
  // if(req.body.name && req.body.current_password && req.body.new_password){
    const userDetails=await customer.findOne({_id : req.session.user})
    const hashedCheck = await bcrypt.compare(
         req.body.current_password,
         userDetails.password
       );
       if (hashedCheck == true){
        const hashedPassword = await bcrypt.hash(req.body.new_password, 10);
        await customer.updateOne({ _id : req.session.user }, { $set: { password : hashedPassword,name : req.body.name } })
        res.redirect('/profile?success=password changed successfully')
       }else{
        res.redirect('/profile?wrong=current password is incorrect')
       }
  // }else{
  //   await customer.updateOne({ _id : req.session.user }, { $set: { name : req.body.name } })
  //   res.redirect('/profile?success=Name changed successfully')
  // }
}catch(error){
  console.log(error);
  res.redirect('/500')
}
}

const orderPage=async (req,res)=>{
  try{
    const brands = await product.distinct("brand");
    const categories = await category.find({ status: true });
    const user=await customer.findOne({_id: req.session.user})
  const order=await orders.find({userId:req.session.user})
  const cartCount=await cart.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    const wishCount=await wishlist.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
   res.render('../views/user/orderPage.ejs',{order,brands,categories,user,cartCount,wishCount})
  }catch(error){
    console.log(error);
    res.redirect('/500')
  }
}

const viewOrderDetails=async (req,res)=>{
  try{
    let id=req.query.id
    id=mongoose.Types.ObjectId(id)
    const brands = await product.distinct("brand");
    const categories = await category.find({ status: true });
    const user =await customer.findOne({_id: req.session.user})
    const cartCount=await cart.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    const wishCount=await wishlist.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
  const productData =await orders.aggregate([
    {$match:{ _id:id }},
    {$unwind:"$orderItems"},
    {$project:{
      address:"$address",
      totalAmount:"$totalAmount",
      productId:"$orderItems.productId",
      productQty:"$orderItems.quantity",
    }},
    {$lookup:{
      from:"products",
      localField:"productId",
      foreignField:"_id",
      as:"data"
    }},
    {$unwind:"$data"},
    {$project:{
      address:"$address",
      totalAmount:"$totalAmount",
      productQty:"$productQty",
      image:"$data.image",
      name:"$data.name",
      brand:"$data.brand",
      price:"$data.price"

    }},
    {$addFields:{
      total:{$multiply:["$productQty","$price"]}
    }}

  ])
   res.render('../views/user/orderHistory.ejs',{productData,brands,categories,user,cartCount,wishCount})
  }catch(error){
    console.log(error);
    res.redirect('/500')
  }
}

const cancelOrder=async (req,res)=>{
  try{
     const id=req.query.id
     await orders.updateOne({ _id : id },{ $set: { orderStatus: "cancelled" }})
     res.redirect('/order')
  }catch(error){
    console.log(error);
    res.redirect('/500')
  }
}

const errorPage=(req,res)=>{
  try{
   res.render('../views/user/errorPage.ejs')
  }catch(error){
    console.log(error);
  }
}


const error500Page=(req,res)=>{
  try{
   res.render('../views/user/500page.ejs')
  }catch(error){
    console.log(error);
  }
}

const logout= async (req, res) => {
  try{
     req.session.destroy()
     console.log('session destroyed')
     res.redirect('/')
  }catch(error){
    console.log(error);
    res.redirect('/500')
  }
}


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
    postAddressEdit,
    addressDelete,
    addressAdd,
    addressDefualt,
    profileEdit,
    orderPage,
    viewOrderDetails,
    cancelOrder,
    errorPage,
    error500Page,
    logout
  }
