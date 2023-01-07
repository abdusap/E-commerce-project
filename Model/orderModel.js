const mongoose=require('mongoose')
 
const orderSchema=mongoose.Schema({
    userId: {
        type:mongoose.Types.ObjectId,
    },
    name: {
        type:String
    },
    number:{
        type: Number
    },
    address: {
        addressline1:String,
        addressline2:String,
        district:String,
        state:String,
        country:String,
        pin:Number
    },
    orderItems: [
        {
            productId:String,
            quantity:Number
        }
    ],
    totalAmount:{
        type: Number
    },
    orderStatus:{
        type: String,
        default: "pending"
    },
    paymentMethod:{
        type: String
    },
    paymentStatus: {
        type: String,
        default: "not paid"
    },
    orderDate: {
        type: Date,
        default:Date.now()
    },
    deliveryDate: {
        type: String
    },
    
})

const orderModel=mongoose.model("order",orderSchema)

module.exports=orderModel