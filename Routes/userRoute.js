const express=require('express')
const router=express.Router()
const user=require('../Controller/user/userContoller')
const product=require('../Controller/user/productController')
const shop=require('../Controller/user/shopController')
const session=require('../Middleware/userSession')




router.get('/login',session.isLogout,user.login)

router.post('/login',session.isLogout,user.userVerfication)

router.get('/signup',session.isLogout,user.signup)

router.post('/signup',session.isLogout,user.userRegister)

router.get('/otp',session.isLogout,user.otp)

router.post('/otpVerification',session.isLogout,user.otpVerification)

router.get('/',user.home)

router.get('/profile',session.isLogin,user.profile)

router.post('/add-address',session.isLogin,user.addressAdd)

router.get('/profile/address-edit',session.isLogin,user.addressEdit)

router.post('/addressedit',user.postAddressEdit)

router.get('/address-delete',session.isLogin,user.addressDelete)

router.get('/address-default',session.isLogin,user.addressDefualt)

router.post('/profileedit',session.isLogin,user.profileEdit)

router.get('/product',product.productPage)

router.get('/product-details',product.productDetails)

router.get('/cart',session.isLogin,shop.userCart)

// router.post('/addtocart',session.isLogin,shop.addToCart)

router.post('/add_to_cart',session.isLogin,shop.add_to_cart)


router.patch('/productadd',session.isLogin,shop.productQtyAdd)

router.patch('/productsub',session.isLogin,shop.productQtySub)
 
router.get('/cart-item-delete',session.isLogin,shop.cartDelete)

router.get('/checkout',session.isLogin,shop.checkOut)

router.post('/checkout',session.isLogin,shop.postCheckOut)

router.get('/wishlist',session.isLogin,shop.viewWishlist)

router.post('/addtowishlist',session.isLogin,shop.addWishlist)

router.post('/setaddress',session.isLogin,shop.setAddressCheckout)

router.post('/coupon_check',session.isLogin,shop.couponCheck)

router.get('/order',session.isLogin,user.orderPage)

router.get('/order/view_orders',session.isLogin,user.viewOrderDetails)

router.get('/order/cancel_orders',session.isLogin,user.cancelOrder)

router.post('/verifyPayment',session.isLogin,shop.verifyPayment)

router.get('/payment_succuss',session.isLogin,shop.paymentSuccess)

router.get('/payment_fail',session.isLogin,shop.paymentFail)




module.exports=router