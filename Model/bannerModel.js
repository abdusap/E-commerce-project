const mongoose = require('mongoose')  

const bannerSchema= new mongoose.Schema(
    {
        name:{
            type:String
        },
        subHeading:{
            type:String
        },
        mainHeading1:{
            type:String
        },
        mainHeading2:{
            type:String
        },
        subHighlight:{
            type:String
        },
        mainHighlight:{
            type:String
        },
        url:{
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