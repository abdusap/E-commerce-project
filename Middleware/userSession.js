const isLogin=(req,res,next)=>{
    if (req.session.user){
        next()
    }else{
        res.redirect('/?showModal=true')
    }
}

const isLogout=(req,res,next)=>{
    if (req.session.user){
        res.redirect('/')
    }else{
        next()
    }
}


module.exports={
    isLogin,
    isLogout,
}