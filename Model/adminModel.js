const mongoose=require('mongoose')

const adminSchema=mongoose.Schema({
    email:{
        type:String
    },
    password:{
        type:String
    }
})

const admin=mongoose.model('admin',adminSchema)

module.exports=admin
