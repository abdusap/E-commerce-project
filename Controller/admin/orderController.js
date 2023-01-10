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
        // console.log(orderDetails);
        // const coupons=await coupon.find()
      res.render('../views/admin/orderManage.ejs',{orderDetails})
    }catch(error){
        console.log(error);
    }
}

const orderUpdate=async (req,res)=>{
    try{
// console.log(req.body);
let id=req.body.orderid
// id=String(id)
// id=mongoose.Types.ObjectId(id)
const status=req.body.orderstatus
// console.log(id);
// console.log(status);
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