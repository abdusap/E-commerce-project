const express=require('express')
const router=express.Router()
const adminController=require('../Controller/admin/adminController')
const categoryController=require('../Controller/admin/categoryController')
const customerController=require('../Controller/admin/customerController')
const productController=require('../Controller/admin/productController')
const couponController=require('../Controller/admin/couponController')
const orderController=require('../Controller/admin/orderController')
const bannerController=require('../Controller/admin/bannerController')
const adminSession=require('../Middleware/adminSession')
const upload = require('../Middleware/uploadFile')

router.get('/login',adminSession.isLogout,adminController.adminLogin)

router.post('/login',adminSession.isLogout,adminController.adminVerification)

router.get('/home',adminSession.isLogin,adminController.home)

router.get('/user',adminSession.isLogin,customerController.userManage)

router.get('/userblock',adminSession.isLogin,customerController.userBlock)

router.get('/category',adminSession.isLogin,categoryController.categoryManage)

router.get('/category-block',adminSession.isLogin,categoryController.categoryBlock)

router.post('/addcategory',adminSession.isLogin,categoryController.addCategory)

router.get('/category/edit',adminSession.isLogin,categoryController.catergoryEdit)

router.post('/category-edit',adminSession.isLogin,categoryController.postCategoryEdit)

router.get('/category-delete',adminSession.isLogin,categoryController.categoryDelete)

router.get('/product',adminSession.isLogin,productController.productManage)

router.post('/addproduct',adminSession.isLogin,upload.array('image',12),productController.addProduct)

router.get('/product/edit',adminSession.isLogin,productController.productEdit)

router.get('/product-block',adminSession.isLogin,productController.productBlock)

router.post('/edit',adminSession.isLogin,upload.array('image',12),productController.postProductEdit)

router.get('/product-delete',adminSession.isLogin,productController.productDelete)

router.get('/coupon',adminSession.isLogin,couponController.couponManage)

router.post('/coupon',adminSession.isLogin,couponController.addCoupon)

router.get('/coupon-block',adminSession.isLogin,couponController.block)

router.get('/order',adminSession.isLogin,orderController.orderManage)

router.post('/order',adminSession.isLogin,orderController.orderUpdate)

router.get('/banner',adminSession.isLogin,bannerController.bannerManage)

router.post('/banner',adminSession.isLogin,upload.array('image',12),bannerController.addBanner)

router.get('/banner_block',adminSession.isLogin,bannerController.bannerBlock)

module.exports=router
