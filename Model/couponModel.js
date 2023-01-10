const mongoose = require('mongoose')  

const couponSchema= new mongoose.Schema(
    {
        name:{
            type:String
        },
        code:{
            type:String
        },
        discount:{
            type:Number
        },
        minAmount:{
            type:Number
        },
        startingDate:{
            type:Date
        },
        expiryDate:{
            type:Date
        },
        status:{
            type:Boolean,
            default:true
        },
        users:[
            {
                userId:mongoose.Types.ObjectId
            }
            
        ]
    }
)

const couponModel=mongoose.model('coupon',couponSchema)
 module.exports=couponModel