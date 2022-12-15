const admin=require('../Model/adminModel')


const adminLogin=(req,res)=>{
    // const wrong=req.query
    res.render('../views/admin/adminLogin.ejs',req.query)
}

const adminVerification=async (req,res)=>{
    // console.log(req.body)
    try{
        const email=req.body.email
        const password=req.body.password
        const adminAccount=await admin.findOne({email:email})
        if(email==adminAccount.email&&password==adminAccount.password){
            res.redirect('/adminHome')
        }
        else{
            res.redirect('/adminlogin?wrong=Email or password Wronge')
            // res.render('../views/admin/adminLogin.ejs',{wrong:'Email or password Wronge'})
        }

    }
    catch{

        res.redirect('/adminlogin?wrong=invalid user')
    }
}

const adminHome=(req,res)=>{
    res.render('../views/admin/adminhome.ejs')
}

const adminUserManage=(req,res)=>{
    res.render('../views/admin/adminUserManagment.ejs')
}

const adminProductManage=(req,res)=>{
    res.render('../views/admin/adminProductManagment.ejs')
}



module.exports={
    adminHome,
    adminLogin,
    adminVerification,
    adminUserManage,
    adminProductManage,
}