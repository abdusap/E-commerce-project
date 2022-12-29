const express=require('express')
const router=express.Router()
const user=require('../Controller/user/userContoller')
const product=require('../Controller/user/productController')
const shop=require('../Controller/user/shopController')




router.get('/login',user.login)

router.post('/login',user.userVerfication)

router.get('/signup',user.signup)

router.post('/signup',user.userRegister)

router.get('/otp',user.otp)

router.post('/otpVerification',user.otpVerification)

router.get('/',user.home)

router.get('/profile',user.profile)

router.post('/add-address',user.addressAdd)

router.get('/profile/address-edit',user.addressEdit)

router.get('/address-delete',user.addressDelete)

router.get('/product',product.productPage)

router.get('/product-details?',product.productDetails)

router.get('/cart',shop.userCart)

router.get('/addtocart?',shop.addToCart)
 
router.get('/cart-item-delete',shop.cartDelete)



module.exports=router