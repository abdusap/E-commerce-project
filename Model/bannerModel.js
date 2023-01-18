const mongoose = require('mongoose')  

const bannerSchema= new mongoose.Schema(
    {
        name:{
            type:String
        },
        image:{
            type:Array
           }
        ,
        date:{
            type:Date,
            default:Date.now()
        },
        status:{
            type:Boolean,
            default:true
        }
        
    }
)

const bannerModel=mongoose.model('banner',bannerSchema)
 module.exports=bannerModel