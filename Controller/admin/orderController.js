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
                orderstatus:"$orderStatus"
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




module.exports = {
    orderManage,
    orderUpdate
    
      };