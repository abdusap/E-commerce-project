const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    name:{
        type:String
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:'category'
    },
    brand:{
        type:String
    },
    description:{
        type:String
    },
    
    ram:{
        type:String
    },
    stock:{
        type:Number
    },
    price:{
        type:Number
    },
    image:{
        type:String
    },
    status:{
        type:Boolean,
        default:true
    }
})

const productModel=mongoose.model('product',productSchema)

module.exports=productModel