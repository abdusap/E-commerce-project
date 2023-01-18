const category = require("../../Model/categoryModel");
const product = require("../../Model/productModel");
const customer = require("../../Model/customerModel");

const mongoose = require("mongoose");

const productPage = async (req, res) => {
    try{
      const user=await customer.findOne({_id: req.session.user})
      const brands = await product.distinct("brand");
      const categories = await category.find({ status: true });
    if(req.query.catId && req.query.brand){
      const productList = await product.find({category : req.query.catId , brand : req.query.brand , status : true});
      res.render("../views/user/product.ejs", { productList, brands, categories ,user});
    }else{
      const productList = await product.find({category : req.query.catId , status : true});
    res.render("../views/user/product.ejs", { productList, brands, categories ,user});
    }
    }catch(error){
        console.log(error);
    }
  };

  const productDetails = async (req, res) => {
    try{
      const user=await customer.findOne({_id: req.session.user})
      const productData = await product.findById(
      new mongoose.Types.ObjectId(req.query.id)
    );
    const brands = await product.distinct("brand");
    const categories = await category.find({ status: true });
    res.render("../views/user/productDetails.ejs", {
      brands,
      categories,
      productData,
      user
    });
}catch(error){
    console.log(error);
}
  };

  const search = async (req, res) => {
    try {
      const user = await customer.findOne({ _id: req.session.user })
      const categories = await category.find({ status: true })
      const brands = await product.distinct('brand')
      const key = req.body.search
      // console.log(key)
      const productList = await product.find({
        $or: [
          { name: new RegExp(key, 'i') }
          // { category: new RegExp(key, "i") },
        ]
      })
      if (productList.length) {
        res.render('user/product', { user, categories, brands, productList })
      } else {
        res.render('user/product', { user, categories, brands, productList, message: 'Ooops ...! No Match' })
      }
    } catch (error) {
      console.log(error)
    }
  }


  module.exports = {
    productPage,
    productDetails,
    search
  };