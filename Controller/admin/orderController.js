const order=require('../../Model/orderModel')
const mongoose=require('mongoose')

const orderManage=async (req,res)=>{
    try{
        const orderDetails=await order.aggregate([
            {$lookup:{
                from:"customers",
                localField:"userId",
                foreignField:"_id",
                as:"userData"
            }},
            {$unwind:"$userData"},
            {$project:{
                orderdate:"$orderDate",
                name:"$userData.name",
                totalamount:"$totalAmount",
                paymentmethod:"$paymentMethod",
                paymentstatus:"$paymentStatus",
                orderstatus:"$orderStatus",
                orderId:"$_id"
            }}
        ])
      res.render('../views/admin/orderManage.ejs',{orderDetails})
    }catch(error){
        console.log(error);
    }
}

const orderUpdate=async (req,res)=>{
    try{
let id=req.body.orderid
const status=req.body.orderstatus
await order.updateOne({ _id : id },{ $set: { orderStatus: status }})
res.redirect('/admin/order')
    }catch(error){
        console.log(error);
    }
}

const viewOrder=async (req,res)=>{
    try{
        let id=req.query.id
        id=mongoose.Types.ObjectId(id)
      const productData =await order.aggregate([
        {$match:{ _id:id }},
        {$unwind:"$orderItems"},
        {$project:{
          address:"$address",
          totalAmount:"$totalAmount",
          productId:"$orderItems.productId",
          productQty:"$orderItems.quantity",
        }},
        {$lookup:{
          from:"products",
          localField:"productId",
          foreignField:"_id",
          as:"data"
        }},
        {$unwind:"$data"},
        {$project:{
          address:"$address",
          totalAmount:"$totalAmount",
          productQty:"$productQty",
          image:"$data.image",
          name:"$data.name",
          brand:"$data.brand",
          price:"$data.price"
    
        }},
        {$addFields:{
          total:{$multiply:["$productQty","$price"]}
        }}
    
      ])
       res.render('../views/admin/orderview.ejs',{productData})
    }catch(error){
        console.log(error);
    }
}



module.exports = {
    orderManage,
    orderUpdate,
    viewOrder
      };