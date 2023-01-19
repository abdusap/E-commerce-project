const customer = require("../../Model/customerModel");
const mongoose = require("mongoose");




// Admin user managment page
const userManage = async (req, res) => {
    try {
      const users = await customer.find();
      res.render("../views/admin/userManagment.ejs", { details: users });
    } catch (error) {
      console.log(error);
      res.redirect('/500')
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
      res.redirect('/500')
    }
  };

  module.exports = {
    
    userManage,
    userBlock,
  };