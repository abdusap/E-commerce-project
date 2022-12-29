const category = require("../../Model/categoryModel");
const product = require("../../Model/productModel");
const mongoose = require("mongoose");

let productPage = async (req, res) => {
    try{
    let brands = await product.distinct("brand");
    let categories = await category.find({ status: true });
    let productList = await product.find();
    res.render("../views/user/product.ejs", { productList, brands, categories });
    }catch(error){
        console.log(error);
    }
  };

  let productDetails = async (req, res) => {
    try{
    let productData = await product.findById(
      new mongoose.Types.ObjectId(req.query.id)
    );
    let brands = await product.distinct("brand");
    let categories = await category.find({ status: true });
    res.render("../views/user/productDetails.ejs", {
      brands,
      categories,
      productData,
    });
}catch(error){
    console.log(error);
}
  };


  module.exports = {
    productPage,
    productDetails
  };