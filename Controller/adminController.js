const admin = require("../Model/adminModel");
const customer = require("../Model/customerModel");
const category = require("../Model/categoryModel");
const product = require("../Model/productModel");
const { findById } = require("../Model/adminModel");
const { find } = require("../Model/customerModel");
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

// Admin user managment page
const userManage = async (req, res) => {
  try {
    const users = await customer.find();
    res.render("../views/admin/userManagment.ejs", { details: users });
  } catch (error) {
    console.log(error);
  }
};

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

const categoryManage = async (req, res) => {
  try {
    const categories = await category.find();
    res.render("../views/admin/categoryManage.ejs", { details: categories });
  } catch (error) {
    console.log(error);
  }
};

const userBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const userdata = await customer.findById({ _id: id });
    if (userdata.status == true) {
      const blockuser = await customer.updateOne(
        { _id: id },
        { $set: { status: false } }
      );
      res.redirect("/admin/user");
    } else {
      const blockuser1 = await customer.updateOne(
        { _id: id },
        { $set: { status: true } }
      );
      res.redirect("/admin/user");
    }
  } catch (error) {
    console.log(error);
  }
};

const addCategory = (req, res) => {
  try {
    const categoryName = req.body.name.toUpperCase();
    const newCategory = new category({
      name: categoryName,
    });
    newCategory.save();
    res.redirect("/admin/category");
  } catch (error) {
    console.log(error);
  }
};

const categoryBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const categoryData = await category.findById({ _id: id });
    if (categoryData.status == true) {
      const updateCategory = await category.updateOne(
        { _id: id },
        { $set: { status: false } }
      );
      res.redirect("/admin/category");
    } else {
      const updateCategory = await category.updateOne(
        { _id: id },
        { $set: { status: true } }
      );
      res.redirect("/admin/category");
    }
  } catch (error) {
    console.log(error);
  }
};

const addProduct = async (req, res) => {
  try {
    let productName = req.body.name.toUpperCase();
    let data = await category.findOne({ name: req.body.category });
    let newProduct = new product({
      name: productName,
      category: data._id,
      brand: req.body.brand,
      description: req.body.description,
      ram: req.body.ram,
      stock: req.body.stock,
      price: req.body.price,
      image: req.file.filename,
    });
    newProduct.save();
    res.redirect("/admin/product");
  } catch (error) {
    console.log(error.message);
  }
};

try {
  let categoryID;
  var catergoryEdit = async (req, res) => {
    try {
      categoryID = req.query.id;
      const categoryData = await category.findById({ _id: categoryID });
      res.render("../views/admin/categoryEdit.ejs", { categoryData });
    } catch (error) {
      console.log(error);
    }
  };

  var postCategoryEdit = async (req, res) => {
    try {
      let categoryName = req.body.name.toUpperCase();
      await category.findByIdAndUpdate(
        { _id: categoryID },
        { $set: { name: categoryName } }
      );
      res.redirect("/admin/category");
    } catch (error) {
      console.log(error);
    }
  };
} catch (error) {
  console.log(error);
}

const categoryDelete = async (req, res) => {
  try {
    const id = req.query.id;
    const deleteCategory = await category.findByIdAndDelete({ _id: id });
    res.redirect("/admin/category");
  } catch (error) {
    console.log(error);
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
              image: req.file.filename,
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
  home,
  adminLogin,
  adminVerification,
  userManage,
  productManage,
  categoryManage,
  userBlock,
  addCategory,
  categoryBlock,
  addProduct,
  catergoryEdit,
  postCategoryEdit,
  categoryDelete,
  productEdit,
  productBlock,
  productDelete,
  postProductEdit,
};
