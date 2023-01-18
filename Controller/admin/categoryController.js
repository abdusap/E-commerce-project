const category = require("../../Model/categoryModel");
const mongoose = require("mongoose");
const sharp= require("sharp")




const categoryManage = async (req, res) => {
    try {
      const categories = await category.find();
      res.render("../views/admin/categoryManage.ejs", { details: categories });
    } catch (error) {
      console.log(error);
    }
  };

  const addCategory = (req, res) => {
    try {
      const categoryName = req.body.name.toUpperCase();
        let name = Date.now() + ".webp";
        sharp(req.file.buffer)
          .resize(207, 309)
          .toFormat("webp")
          .webp({ quality: 100 })
          .toFile("Public/user/images/categories/" + name);

      const newCategory = new category({
        name: categoryName,
        image:name
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
        if(req.file==undefined){
        await category.findByIdAndUpdate(
          { _id: categoryID },
          { $set: { name: categoryName } }
        );
        res.redirect("/admin/category");
        }else{
          let name = Date.now() + ".webp";
          sharp(req.file.buffer)
            .resize(207, 309)
            .toFormat("webp")
            .webp({ quality: 100 })
            .toFile("Public/user/images/categories/" + name);
            await category.findByIdAndUpdate(
              { _id: categoryID },
              { $set: { name: categoryName,image:name } }
            );
            res.redirect("/admin/category");
        }
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

  module.exports = {
    categoryManage,
    addCategory,
    categoryBlock,
    catergoryEdit,
    postCategoryEdit,
    categoryDelete,
     };