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
    },
    status:{
        type:Boolean,
        default:true
    },
    address:[
        {
            name : String,
            addressline1 : String,
            addressline2 : String,
            district : String,
            state : String,
            country : String,
            pin : Number,
            mobile : Number,
            status : {
                type : Boolean,
                default : false
            }
        }
    ]
})

const customer=mongoose.model('customer',userSchema)

module.exports=customer