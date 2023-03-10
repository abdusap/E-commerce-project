const customer = require("../../Model/customerModel");
const category = require("../../Model/categoryModel");
const product = require("../../Model/productModel");
const cart = require("../../Model/cartModal");
const coupon=require("../../Model/couponModel")
const mongoose = require("mongoose");
const order = require("../../Model/orderModel");
const wishlist = require("../../Model/wishlistModel");
const instance=require("../../Middleware/razorpay")
const crypto=require("crypto");
const { productDetails } = require("./productController");

const userCart = async (req, res) => {
  try {
    const user = await customer.findOne({ _id: req.session.user });
    const brands = await product.distinct("brand");
    const categories = await category.find({ status: true });
    const cartExist=await cart.findOne({userId:req.session.user})
    const cartCount=await cart.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    const wishCount=await wishlist.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
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
      cartExist,
      cartCount,
      wishCount
    });
  } catch (error) {
    console.log(error);
    res.redirect('/500')
  }
};



const addToCart=async (req,res)=>{
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
          res.json({success:true,count})
      }
      }else{
        res.json({outofStock:true})
      }
  }catch(error){
    console.log(error);
    res.redirect('/500')
  }
}

const cartDelete = async (req, res) => {
  try {
    await cart.updateOne(
      { userId: req.session.user },
      { $pull: { cartItem: { productId: req.body.proId } } }
    );
    res.json({success:true})
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
    if (productData.stock>qty ){
          const price=productData.price
          await cart.updateOne(
               { userId: req.session.user, "cartItem.productId": proId },
               { $inc: { "cartItem.$.qty": 1 } })
              res.json({price})
    }else{
      res.json({outStock:true})
    }
  } catch (error) {
    console.log(error);
    res.redirect('/500')
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
    res.redirect('/500')
  }
};


const checkOut = async (req, res) => {
  try {
    let cartCheck= await cart.findOne({userId:req.session.user})
    if(cartCheck!=null){
      if(cartCheck.cartItem.length!=0){
    let cartItems = await cart.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.session.user)} },
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
    const subtotal = cartItems.reduce( (acc, curr)=> {
      acc = acc + curr.total;
      return acc;
    }, 0);
    const user = await customer.findOne({ _id: req.session.user });
    const brands = await product.distinct("brand");
    const categories = await category.find({ status: true });
    const cartCount=await cart.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    const wishCount=await wishlist.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
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
      cartCount,
      wishCount
    });
  }else{
      res.redirect('/')
  }
}else{
  res.redirect('/')
}

  } catch (error) {
    console.log(error);
    res.redirect('/500')
  }
};

const postCheckOut = async (req, res) => {
  try {
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
        const subtotal = cartItems.reduce( (acc, curr)=> {
          acc = acc + curr.total;
          return acc;
        }, 0);
        if (req.body.couponid === ''){
     
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
          subTotal: subtotal,
          totalAmount: subtotal,
          paymentMethod: "COD",
        });
        await orderDetails.save();
        let productDetails=productData
    for(let i =0;i<productDetails.length;i++){
        await product.updateOne({_id:productDetails[i].productId},{$inc:{stock:-(productDetails[i].quantity)}})
    }
    await cart.findOneAndDelete({userId:mongoose.Types.ObjectId(req.session.user)})
    req.session.success=true
        res.json({CODSuccess:true})
      }else{
        await coupon.updateOne({_id:req.body.couponid}, { $push: { users: { userId:req.session.user} } })

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
          couponUsed:req.body.couponid,
          subTotal: subtotal,
          totalAmount: req.body.total,
          paymentMethod: "COD",
        });
        await orderDetails.save();
        let productDetails=productData
    for(let i =0;i<productDetails.length;i++){
        await product.updateOne({_id:productDetails[i].productId},{$inc:{stock:-(productDetails[i].quantity)}})
    }
    await cart.findOneAndDelete({userId:mongoose.Types.ObjectId(req.session.user)})
        req.session.success=true
        res.json({CODSuccess:true})
      }
      }
      if (req.body.payment_mode == "pay") {
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
        const subtotal = cartItems.reduce( (acc, curr)=> {
          acc = acc + curr.total;
          return acc;
        }, 0);
        if (req.body.couponid === ''){
        const orderDetails =({
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
          subTotal: subtotal,
          totalAmount: subtotal,
          paymentMethod: "Online Payment",
        });
        var options = {
          amount: subtotal*100,  // amount in the smallest currency unit
          currency: "INR",
          receipt: "order_rcptid_11"
        };

        instance.orders.create(options, function(err, order) {
          if(err){
          console.log(err);
          console.log('online payment error');
          res.json({fail:true})
          }else{
            res.json({order,orderDetails})
          }
        });
      }else{
        const orderDetails =({
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
          couponUsed:req.body.couponid,
          subTotal: subtotal,
          totalAmount: req.body.total,
          paymentMethod: "Online Payment",
        });  
         let totalAmount=req.body.total
         totalAmount=parseInt(totalAmount)
        var options = {
          amount: totalAmount*100,  // amount in the smallest currency unit
          currency: "INR",
          receipt: "order_rcptid_11"
        };
         instance.orders.create(options, function(err, order) {
          if(err){
          console.log(err);
          console.log('online payment error');
          res.json({fail:true})
          }else{
            res.json({order,orderDetails})
          }
        });
      }
      }
  } catch (error) {
    console.log(error);
    res.redirect('/500')
  }
};


const verifyPayment= async (req, res) => {
try{
  const details = req.body;
  let orderDetails=req.body.orderDetails
  let hmac = crypto.createHmac("sha256", process.env.KEYSECRET);
  hmac.update(details.payment.razorpay_order_id + "|" + details.payment.razorpay_payment_id);
  hmac = hmac.digest("hex");

  if (hmac == details.payment.razorpay_signature) {
    if ( 'couponUsed' in orderDetails){
      await coupon.updateOne({_id:orderDetails.couponUsed}, { $push: { users: { userId:req.session.user} } })
      let productDetails=orderDetails.orderItems
      for(let i =0;i<productDetails.length;i++){
       await product.updateOne({_id:productDetails[i].productId},{$inc:{stock:-(productDetails[i].quantity)}})
   }
   await cart.findOneAndDelete({userId:mongoose.Types.ObjectId(req.session.user)})
    orderDetails=new order(orderDetails)
      await orderDetails.save()
      req.session.success=true
    res.json({success:true})
    }else{
     let productDetails=orderDetails.orderItems
     for(let i =0;i<productDetails.length;i++){
      await product.updateOne({_id:productDetails[i].productId},{$inc:{stock:-(productDetails[i].quantity)}})
  }
  await cart.findOneAndDelete({userId:mongoose.Types.ObjectId(req.session.user)})
      orderDetails=new order(orderDetails)
      await orderDetails.save()
      req.session.success=true
      res.json({success:true})
    }
  } else {
    console.log(err);
    res.json({ failed:true});
  }
}catch(error){
  console.log(error)
  res.redirect('/500')
}
}

const paymentSuccess=async (req,res)=>{
try{
  if(req.session.success){
    const user = await customer.findOne({ _id: req.session.user });
    const brands = await product.distinct("brand");
    const categories = await category.find({ status: true });
    const cartCount=await cart.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    const wishCount=await wishlist.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    req.session.success=false
    res.render('../views/user/paymentSuccess.ejs',{user,brands,categories,cartCount,wishCount})
  }else{
    res.redirect('/')
  }
}catch(error){
  console.log(error);
  res.redirect('/500')
}
}

const paymentFail=async (req,res)=>{
  try{
      const user = await customer.findOne({ _id: req.session.user });
      const brands = await product.distinct("brand");
      const categories = await category.find({ status: true });
      const cartCount=await cart.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    const wishCount=await wishlist.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
      res.render('../views/user/paymentFail.ejs',{user,brands,categories,cartCount,wishCount})
  }catch(error){
    console.log(error);
    res.redirect('/500')
  }
  }


const viewWishlist=async (req,res)=>{
  try{
    const user = await customer.findOne({ _id: req.session.user });
    const brands = await product.distinct("brand");
    const categories = await category.find({ status: true });
    const wishlistExist=await wishlist.findOne({userId:req.session.user})
    const cartCount=await cart.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    const wishCount=await wishlist.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
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
    res.render('../views/user/wishlist.ejs',{user,brands,categories,wishList,wishlistExist,cartCount,wishCount})
  }catch(error){
    console.log(error);
    res.redirect('/500')
  }
}




const addWishlist = async(req,res)=>{
  try {
      const data = req.body
      const id = data.prodId
      const userId = req.session.user;
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
          )
          const wishlistData =await wishlist.findOne({userId:Id})
               const count=wishlistData.wishList.length
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
          res.json({success:true,count})
      }    
  } catch (error) {
      console.log(error.message);
      res.redirect('/500')
  }
}

const deleteWishlist=async (req,res)=>{
  try{
    await wishlist.updateOne(
      { userId: req.session.user },
      { $pull: { wishList: { productId: req.body.proId } } }
    );
    res.json({success:true})
  }catch(error){
    console.log(error);
    res.redirect('/500')
  }
}


const setAddressCheckout=async (req,res)=>{
  try{
   const addresId=req.body.addresId
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
  res.json({data:address})
  }catch(error){
    console.log(error);
    res.redirect('/500')
  }
}

const couponCheck=async (req,res)=>{
  try{
    const code=req.body.input
    let total=req.body.total
    total=parseInt(total)
     coupon.findOne({code:code}).then((couponExist)=>{
      if(couponExist){
        let currentDate = new Date();
        if (currentDate >= couponExist.startingDate && currentDate <= couponExist.expiryDate) {
          let id=req.session.user
          id = mongoose.Types.ObjectId(req.session.user)
          // const userExist = couponExist.users.findIndex((couponExist) => couponExist.users == id);
          coupon.findOne({code:code},{users:{$elemMatch:{userId: id}}}).then((exist)=>{
            if(exist.users.length===0){
              if(total>=couponExist.minAmount){
                res.json({couponApplied:couponExist})
              }else{
                let minAmount=couponExist.minAmount
                res.json({minAmount})
              }
              
            }else{
              res.json({userUsed:true})
            }
          })
        } else {
          res.json({expired:true})
          
        }
      }else{
           res.json({notExist:true})
      }
    })
  }catch(error){
    console.log(error);
    res.redirect('/500')
  }
}




module.exports = {
  userCart,
  addToCart,
  cartDelete,
  productQtyAdd,
  productQtySub,
  checkOut,
  postCheckOut,
  viewWishlist,
  addWishlist,
  deleteWishlist,
  setAddressCheckout,
  couponCheck,
  verifyPayment,
  paymentSuccess,
  paymentFail
};
