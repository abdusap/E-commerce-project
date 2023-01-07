const isLogin=(req,res,next)=>{
    if (req.session.user){
        next()
    }else{
        res.redirect('/login')
    }
}

const isLogout=(req,res,next)=>{
    if (req.session.user){
        res.redirect('/home')
    }else{
        next()
    }
}


module.exports={
    isLogin,
    isLogout,
}