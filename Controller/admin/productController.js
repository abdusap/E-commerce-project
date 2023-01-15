const category = require("../../Model/categoryModel");
const product = require("../../Model/productModel");
const mongoose = require("mongoose");
const sharp = require("sharp");

// Admin product manage page
const productManage = async (req, res) => {
  try {
    const categories = await category.find({ status: true });
    const products = await product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "catData",
        },
      },
    ]);
    res.render("../views/admin/productManagment.ejs", { categories, products });
  } catch (error) {
    console.log(error);
  }
};

const addProduct = async (req, res) => {
  try {
    // console.log(req.files[0]);
    // console.log(req.files.length);
    let images = [];
    for (let i = 0; i < req.files.length; i++) {
      // console.log('a')
      let name = Date.now() + "-"+i + ".png";
      // console.log(req.files[i]);
      sharp(req.files[i].buffer)
        .resize(1200, 1200)
        .toFormat("png")
        .png({ quality: 100 })
        .toFile("Public/admin/product/" + name);
      images.push(name);
      // console.log("---"+name);
    }
    console.log(images);
    let productName = req.body.name.toUpperCase();
    let data = await category.findOne({ name: req.body.category });
    // let newProduct = new product({
    //   name: productName,
    //   category: data._id,
    //   brand: req.body.brand,
    //   description: req.body.description,
    //   ram: req.body.ram,
    //   stock: req.body.stock,
    //   price: req.body.price,
    //   image: req.files,
    // });
    // newProduct.save();
    res.redirect("/admin/product");
  } catch (error) {
    console.log(error.message);
  }
};

const productBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const productData = await product.findById({ _id: id });
    if (productData.status == true) {
      await product.updateOne({ _id: id }, { $set: { status: false } });
      res.redirect("/admin/product");
    } else {
      await product.updateOne({ _id: id }, { $set: { status: true } });
      res.redirect("/admin/product");
    }
  } catch (error) {
    console.log(error);
  }
};

try {
  let productID;
  var productEdit = async (req, res) => {
    try {
      const categoryData = await category.find({ status: true });
      productID = req.query.id;
      const productData = await product.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(productID),
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "catData",
          },
        },
      ]);
      res.render("../views/admin/productEdit.ejs", {
        categoryData,
        productData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  var postProductEdit = async (req, res) => {
    try {
      if (typeof req.file === "undefined") {
        let data = await category.findOne({ name: req.body.category });
        let productName = req.body.name.toUpperCase();
        await product.findByIdAndUpdate(
          { _id: productID },
          {
            $set: {
              name: productName,
              category: data._id,
              brand: req.body.brand,
              description: req.body.description,
              ram: req.body.ram,
              stock: req.body.stock,
              price: req.body.price,
            },
          }
        );
        res.redirect("/admin/product");
      } else {
        let data = await category.findOne({ name: req.body.category });
        let productName = req.body.name.toUpperCase();
        console.log(req.file.filename);
        await product.findByIdAndUpdate(
          { _id: productID },
          {
            $set: {
              name: productName,
              category: data._id,
              brand: req.body.brand,
              description: req.body.description,
              ram: req.body.ram,
              stock: req.body.stock,
              price: req.body.price,
              image: req.files,
            },
          }
        );
        res.redirect("/admin/product");
      }
    } catch (error) {
      console.log(error);
    }
  };
} catch (error) {
  console.log(error);
}

const productDelete = async (req, res) => {
  try {
    const id = req.query.id;
    await product.findByIdAndDelete({ _id: id });
    res.redirect("/admin/product");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  productManage,
  addProduct,
  productEdit,
  productBlock,
  productDelete,
  postProductEdit,
};
