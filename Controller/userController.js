const customer=require('../Model/customer')




const login = (req, res) => {
   
    
    // if(req.session.user){
    //     res.redirect('/home')
    // }
    // else{
        res.render('../views/user/login.ejs')
        // res.write('hai')
    // }
}

const signup=(req,res)=>{
    res.render('../views/user/sign_up.ejs')
}

const userVerfication=(req,res)=>{
    console.log(req.body);
}

const userRegister=(req,res)=>{


    const customer1=new customer({
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
        password:req.body.password

    })
    customer1.save();
    console.log(req.body)
}
module.exports={
    login,
    signup,
userVerfication,
userRegister,}