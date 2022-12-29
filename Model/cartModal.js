let mongoose = require('mongoose')

let cartSchema=new mongoose.Schema({
    userId : {
        type: mongoose.Types.ObjectId,
        ref : 'customer'
    },
    cartItem : [{
        productId:{
            type:mongoose.Types.ObjectId,
            ref:'product'
        },
        qty:{
            type:Number,
            required:true,
            default:1
        }
    }]
    
})

let cart=mongoose.model('cart',cartSchema)

module.exports=cart
