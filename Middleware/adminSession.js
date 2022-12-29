let isLogin=(req,res,next)=>{
if(req.session.admin){
    next()
}else{
    res.redirect('/admin/login')
}
}

let isLogout=(req,res,next)=>{
    if(req.session.admin){
        res.redirect('/admin/home')
    }
    else{
        next()
    }
}
module.exports={
    isLogin,
    isLogout
}