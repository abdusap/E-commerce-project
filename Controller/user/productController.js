const category = require("../../Model/categoryModel");
const product = require("../../Model/productModel");
const customer = require("../../Model/customerModel");
const wishlist = require("../../Model/wishlistModel");
const cart = require("../../Model/cartModal");
const mongoose = require("mongoose");

const productPage = async (req, res) => {
    try{
      const user=await customer.findOne({_id: req.session.user})
      const brands = await product.distinct("brand");
      const categories = await category.find({ status: true });
      const cartCount=await cart.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    const wishCount=await wishlist.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    if(req.query.catId && req.query.brand){
      const productList = await product.find({category : req.query.catId , brand : req.query.brand , status : true});
      res.render("../views/user/product.ejs", { productList, brands, categories ,user,cartCount,wishCount});
    }else{
      const productList = await product.find({category : req.query.catId , status : true});
    res.render("../views/user/product.ejs", { productList, brands, categories ,user,cartCount,wishCount});
    }
    }catch(error){
        console.log(error);
        res.redirect('/500')
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
    const cartCount=await cart.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    const wishCount=await wishlist.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    res.render("../views/user/productDetails.ejs", {
      brands,
      categories,
      productData,
      user,
      cartCount,
      wishCount
    });
}catch(error){
    console.log(error);
    res.redirect('/500')
}
  };

  const search = async (req, res) => {
    try {
      const user = await customer.findOne({ _id: req.session.user })
      const categories = await category.find({ status: true })
      const brands = await product.distinct('brand')
      const cartCount=await cart.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    const wishCount=await wishlist.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
      const key = req.body.search
      const productList = await product.find({
        $or: [
          { name: new RegExp(key, 'i') }
          // { category: new RegExp(key, "i") },
        ]
      })
      if (productList.length) {
        res.render('user/product', { user, categories, brands, productList,cartCount,wishCount })
      } else {
        res.render('user/product', { user, categories, brands, productList,cartCount,wishCount, message: 'Ooops ...! No Match' })
      }
    } catch (error) {
      console.log(error)
      res.redirect('/500')
    }
  }


  module.exports = {
    productPage,
    productDetails,
    search
  };