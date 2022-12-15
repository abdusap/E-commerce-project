const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    mobile:{
        type:String
    },
    password:{
        type:String
    }
})

const customer=mongoose.model('customer',userSchema)

module.exports=customer