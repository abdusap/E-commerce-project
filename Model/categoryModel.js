const mongoose=require('mongoose')
 
const categorySchema=mongoose.Schema({
    name:{
        type:String
    },
    image:{
        type:String
    },
    status:{
        type:Boolean,
        default:true
    }
})

const categoryModel=mongoose.model("category",categorySchema)

module.exports=categoryModel