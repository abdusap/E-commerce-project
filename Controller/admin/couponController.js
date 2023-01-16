const coupon=require('../../Model/couponModel')
const mongoose=require('mongoose')

const couponManage=async (req,res)=>{
    try{
        const coupons=await coupon.find()
      res.render('../views/admin/couponManage.ejs',{coupons})
    }catch(error){
        console.log(error);
    }
}

const addCoupon=(req,res)=>{
    try{
        const code=req.body.code.toUpperCase()
        const newCoupon = new coupon({
            name: req.body.name,
            code: code,
            discount:req.body.discount,
            minAmount:req.body.minamount,
            startingDate: req.body.startingdate,
            expiryDate: req.body.expirydate,
        })
        newCoupon.save()
        res.redirect("/admin/coupon")
    }catch(error){
        console.log(error);
    }
}


const block = async (req, res) => {
    const id = req.query.id
    const couponData = await coupon.findById({ _id: id })
    if (couponData.status === true) {
      await coupon.updateOne({ _id: id }, { $set: { status: false } })
      res.redirect('/admin/coupon')
    } else {
      await coupon.updateOne({ _id: id }, { $set: { status: true } })
      res.redirect('/admin/coupon')
    }
  }









module.exports = {
   couponManage,
   addCoupon,
   block
   
     };