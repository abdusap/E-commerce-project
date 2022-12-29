const customer = require("../../Model/customerModel");
const category = require("../../Model/categoryModel");
const product = require("../../Model/productModel");
const cart = require("../../Model/cartModal");
const mongoose = require("mongoose");

let userCart = async (req, res) => {
    try {
      let brands = await product.distinct("brand");
      let categories = await category.find({ status: true });
      let email = "ajmal@gmail.com";
      let userId = await customer.findOne({ email: email });
      let cartItems = await cart.aggregate([
        { $match: { userId: userId._id } },
        { $unwind: "$cartItem" },
        {
          $project: {
            productId: "$cartItem.productId",
            qty: "$cartItem.qty",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            name: "$productDetails.name",
            price: "$productDetails.price",
            image: "$productDetails.image",
            qty: "$qty",
            id: "$productDetails._id",
          },
        },
        {
          $addFields: {
            total: { $multiply: ["$price", "$qty"] },
          },
        },
      ]);
      console.log(cartItems);
      res.render("../views/user/cart.ejs", { brands, categories, cartItems });
    } catch (error) {
      console.log(error);
    }
  };

  let addToCart = async (req, res) => {
    try {
      let email = "ajmal@gmail.com";
      let id = req.query.id;
      console.log(id);
      let userId = await customer.findOne({ email: email });
      let exist = await cart.find({
        cartItem: { $elemMatch: { productId: id } },
      });
      let exist1=await cart.aggregate([
        {
           $match: {
              $and: [
                 { userId: userId._id },
                  {"cartItem": { $elemMatch: { productId: new mongoose.Types.ObjectId(id)  } }}
                    // cartItem: { $elemMatch: { productId: new mongoose.Types.ObjectId(id) } }
              ]
            
           }
        }
     ])
    //  console.log(exist1);
      if (exist1.length === 0) {
        await cart.updateOne(
          { userId: userId._id },
          { $push: { cartItem: { productId: id } } },
          { upsert: true }

        );
        console.log('if');
        res.redirect("/cart");
      } else {        
        await cart.updateOne(
          { userId: userId._id , "cartItem.productId":id },
          { $inc: { "cartItem.$.qty": 1 } },
        );
        res.redirect("/cart");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  let cartDelete = async (req, res) => {
    try {
      let email = "ajmal@gmail.com";
      let userId = await customer.findOne({ email: email });
      await cart.updateOne(
        { userId: userId._id },
        { $pull: { cartItem: { productId: req.query.id } } }
      );
      res.redirect("/cart");
    } catch (error) {
      console.log(error);
    }
  };
  
  module.exports = {
    
    userCart,
    addToCart,
    cartDelete,
  };