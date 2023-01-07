const customer = require("../../Model/customerModel");
const category = require("../../Model/categoryModel");
const product = require("../../Model/productModel");
const cart = require("../../Model/cartModal");
const mongoose = require("mongoose");
const order = require("../../Model/orderModel");
const wishlist = require("../../Model/wishlistModel");

const userCart = async (req, res) => {
  try {
    const user = await customer.findOne({ _id: req.session.user });
    const brands = await product.distinct("brand");
    const categories = await category.find({ status: true });
    const cartItems = await cart.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
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
          userId: "$userId",
        },
      },
      {
        $addFields: {
          total: { $multiply: ["$price", "$qty"] },
        },
      },
    ]);
    const subtotal = cartItems.reduce( (acc, curr)=> {
      acc = acc + curr.total;
      return acc;
    }, 0);
    res.render("../views/user/cart.ejs", {
      brands,
      categories,
      cartItems,
      user,
      subtotal,
    });
  } catch (error) {
    console.log(error);
  }
};

// let addToCart = async (req, res) => {
//   try {
//     const data = req.body;
//     const id = data.Id;
//     const exist1 = await cart.aggregate([
//       {
//         $match: {
//           $and: [
//             { userId: mongoose.Types.ObjectId(req.session.user) },
//             {
//               cartItem: {
//                 $elemMatch: { productId: new mongoose.Types.ObjectId(id) },
//               },
//             },
//           ],
//         },
//       },
//     ]);
//     if (exist1.length === 0) {
//       await cart.updateOne(
//         { userId: req.session.user },
//         { $push: { cartItem: { productId: id } } },
//         { upsert: true }
//       );
//       const cartCount = await cart.find({
//         userId: mongoose.Types.ObjectId(req.session.user),
//       });
//       const count = cartCount[0].cartItem.length;
//       res.json({ cout: count });
//       // res.redirect("/cart");
//     } else {
//       await cart.updateOne(
//         { userId: req.session.user, "cartItem.productId": id },
//         { $inc: { "cartItem.$.qty": 1 } }
//       );
//       const cartCount = await cart.find({
//         userId: mongoose.Types.ObjectId(req.session.user),
//       });
//       const count = cartCount[0].cartItem.length;
//       res.json({ cout: count });
      // res.redirect("/cart");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

const add_to_cart=async (req,res)=>{
  try{
    const proId= req.body.Id  
    const Id=mongoose.Types.ObjectId(proId)
      const productData=await product.findOne({_id:proId})
      const id=mongoose.Types.ObjectId(req.session.user)
      if (productData.stock>0){
        const cartExist=await cart.findOne({userId:id})
        if(cartExist){        
          const exist1 = await cart.aggregate([
            {
              $match: {
                $and: [
                  { userId: mongoose.Types.ObjectId(req.session.user) },
                  {
                    cartItem: {
                      $elemMatch: { productId: new mongoose.Types.ObjectId(proId) },
                    },
                  },
                ],
              },
            },
          ]);
         if(exist1.length === 0){
          const dataPush = await cart.updateOne({userId:id},
            {
                $push:{cartItem:{ productId:proId } },
            }
        )
        const cartData =await cart.findOne({userId:id})
             const count=cartData.cartItem.length          
            res.json({success:true,count})
         }else{
          res.json({exist:true})
         } 
      }else{
          const addCart = new cart({
              userId:id,
              cartItem:[{productId:proId}]
          })
          await addCart.save()
          const cartData =await cart.findOne({userId:id})
               const count=cartData.cartItem.length
               console.log(count);  
          res.json({success:true,count})
      }
      }else{
        res.json({outofStock:true})
      }
  }catch(error){
    console.log(error);
  }
}

const cartDelete = async (req, res) => {
  try {
    await cart.updateOne(
      { userId: req.session.user },
      { $pull: { cartItem: { productId: req.query.id } } }
    );
    res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

const productQtyAdd = async (req, res) => {
  try {
    const data=req.body
    const proId=data.Id
    const qty=parseInt(data.qty)
    const productData=await product.findOne({_id:proId})
    if (productData.stock>0 ){
         if( qty < 10){
          const price=productData.price
          await cart.updateOne(
               { userId: req.session.user, "cartItem.productId": proId },
               { $inc: { "cartItem.$.qty": 1 } })
              res.json({price})
         }else{
          res.json({limit:true})
         }
    }else{
      res.json({outStock:true})
    }
  } catch (error) {
    console.log(error);
  }
};

const productQtySub = async (req, res) => {
  try {
    const data=req.body
    const proId=data.Id
    const qty=parseInt(data.qty)
    const productData=await product.findOne({_id:proId})
    if (productData.stock>0 ){
         if( qty > 1){
          const price=productData.price
          await cart.updateOne(
               { userId: req.session.user, "cartItem.productId": proId },
               { $inc: { "cartItem.$.qty": -1 } })
              res.json({price})
         }else{
          res.json({limit:true})
         }
    }else{
      res.json({outStock:true})
    }
  } catch (error) {
    console.log(error);
  }
};

let subtotal;
const checkOut = async (req, res) => {
  try {
    subtotal = req.query.subtotal;
    let cartItems = await cart.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
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
          qty: "$qty",
          id: "$productDetails._id",
          userId: "$userId",
        },
      },
      {
        $addFields: {
          total: { $multiply: ["$price", "$qty"] },
        },
      },
    ]);
    const user = await customer.findOne({ _id: req.session.user });
    const brands = await product.distinct("brand");
    const categories = await category.find({ status: true });
    const address = await customer.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.session.user) } },
      { $unwind: "$address" },
      {
        $project: {
          name: "$address.name",
          addressline1: "$address.addressline1",
          addressline2: "$address.addressline2",
          district: "$address.distict",
          state: "$address.state",
          country: "$address.country",
          pin: "$address.pin",
          mobile: "$address.mobile",
          id: "$address._id",
        },
      },
    ]);
    res.render("../views/user/checkout.ejs", {
      user,
      brands,
      categories,
      address,
      cartItems,
      subtotal,
    });
  } catch (error) {
    console.log(error);
  }
};

const postCheckOut = async (req, res) => {
  try {
    if (req.body.address == "") {
      console.log("hau");
      if (req.body.payment_mode == "COD") {
        const productData = await cart.aggregate([
          { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
          { $unwind: "$cartItem" },
          {
            $project: {
              _id: 0,
              productId: "$cartItem.productId",
              quantity: "$cartItem.qty",
            },
          },
        ]);
        const orderDetails = new order({
          userId: req.session.user,
          name: req.body.name,
          number: req.body.mobile,
          address: {
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            district: req.body.district,
            state: req.body.state,
            country: req.body.country,
            pin: req.body.pin,
          },
          orderItems: productData,
          totalAmount: subtotal,
          paymentMethod: "COD",
        });
        await orderDetails.save();
        res.redirect('/')
      }
      if (req.body.payment_mode == "pay") {
        console.log("null pay");
      }
    } else {
      if (req.body.payment_mode == "COD") {
        const productData = await cart.aggregate([
          { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
          { $unwind: "$cartItem" },
          {
            $project: {
              _id: 0,
              productId: "$cartItem.productId",
              quantity: "$cartItem.qty",
            },
          },
        ]);
        const address = await customer.aggregate([
          { $match: { _id: mongoose.Types.ObjectId(req.session.user) } },
          { $unwind: "$address" },
          {
            $project: {
              name: "$address.name",
              addressline1: "$address.addressline1",
              addressline2: "$address.addressline2",
              district: "$address.distict",
              state: "$address.state",
              country: "$address.country",
              pin: "$address.pin",
              mobile: "$address.mobile",
              id: "$address._id",
            },
          },
          { $match: { id: mongoose.Types.ObjectId(req.body.address) } },
        ]);
        const orderDetails = new order({
          userId: req.session.user,
          name: address[0].name,
          number: address[0].mobile,
          address: {
            addressline1: address[0].addressline1,
            addressline2: address[0].addressline2,
            district: address[0].district,
            state: address[0].state,
            country: address[0].country,
            pin: address[0].pin,
          },
          orderItems: productData,
          totalAmount: subtotal,
          paymentMethod: "COD",
        });
        await orderDetails.save();
        res.redirect('/')
      } else {
        console.log("choose address online payment");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const viewWishlist=async (req,res)=>{
  try{
    const user = await customer.findOne({ _id: req.session.user });
    const brands = await product.distinct("brand");
    const categories = await category.find({ status: true });
    const wishList = await wishlist.aggregate([
      { $match: { userId: user._id } },
      { $unwind: "$wishList" },
      {
        $project: {
          productId: "$wishList.productId",
          qty: "$wishList.qty",
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
    res.render('../views/user/wishlist.ejs',{user,brands,categories,wishList})
  }catch(error){
    console.log(error);
  }
}




const addWishlist = async(req,res)=>{
  try {
      const data = req.body
      const id = data.prodId
    
      // console.log(id);
      const userId = req.session.user;
      // console.log(userId);
      const Id = mongoose.Types.ObjectId(userId)
      const wish = await wishlist.findOne({userId:Id})
      if(wish){
        
          let wishlistEx = wish.wishList.findIndex((wishList)=>
          
          wishList.productId == id
          );
         if(wishlistEx != -1){
          res.json({wish:true})

         }else{
          const dataPush = await wishlist.updateOne({userId:Id},
              {
                  $push:{wishList:{ productId:id } },
              }
              // ).then(()=>{
              //     res.redirect('/product')
              // })
          )
          const wishlistData =await wishlist.findOne({userId:Id})
               const count=wishlistData.wishList.length
               console.log(count);             
              res.json({success:true,count})

         } 
      }else{
          const addWish = new wishlist({
              userId:userId,
              wishList:[{productId:id}]
          })
          await addWish.save()
          const wishlistData =await wishlist.findOne({userId:Id})
               const count=wishlistData.wishList.length
               console.log(count);  
          res.json({success:true,count})


      }

     
  } catch (error) {
      console.log(error.message);
  }
}


const setAddressCheckout=async (req,res)=>{
  try{
  //  console.log(req.body.addresId);
   const addresId=req.body.addresId
  //  console.log(addresId);
   const address = await customer.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.session.user) } },
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
      },
    },
    { $match: { _id: new mongoose.Types.ObjectId(addresId)} },
  ]);
  // console.log(address);
  res.json({data:address})
  }catch(error){
    console.log(error);
  }
}

module.exports = {
  userCart,
  // addToCart,
  add_to_cart,
  cartDelete,
  productQtyAdd,
  productQtySub,
  checkOut,
  postCheckOut,
  viewWishlist,
  addWishlist,
  setAddressCheckout
};