const express=require('express')
const router=express.Router()
const adminController=require('../Controller/admin/adminController')
const categoryController=require('../Controller/admin/categoryController')
const customerController=require('../Controller/admin/customerController')
const productController=require('../Controller/admin/productController')
const couponController=require('../Controller/admin/couponController')
const orderController=require('../Controller/admin/orderController')
const bannerController=require('../Controller/admin/bannerController')
const salesController=require('../Controller/admin/salesController')
const adminSession=require('../Middleware/adminSession')
const upload = require('../Middleware/uploadFile')
const uploadbuffer =require("../Middleware/multerBuffer")

// Login section
router.get('/login',adminSession.isLogout,adminController.adminLogin)
router.post('/login',adminSession.isLogout,adminController.adminVerification)

// Logout section
router.get('/logout',adminSession.isLogin,adminController.logout)

router.get('/home',adminSession.isLogin,adminController.home)
// User management
router.get('/user',adminSession.isLogin,customerController.userManage)
router.get('/userblock',adminSession.isLogin,customerController.userBlock)

// Category management
router.get('/category',adminSession.isLogin,categoryController.categoryManage)
router.get('/category-block',adminSession.isLogin,categoryController.categoryBlock)
router.post('/addcategory',adminSession.isLogin,upload.single('image'),categoryController.addCategory)
router.get('/category/edit',adminSession.isLogin,categoryController.catergoryEdit)
router.post('/category-edit',adminSession.isLogin,upload.single('image'),categoryController.postCategoryEdit)
router.get('/category-delete',adminSession.isLogin,categoryController.categoryDelete)

// Product management
router.get('/product',adminSession.isLogin,productController.productManage)
router.post('/addproduct',adminSession.isLogin,upload.array('image',12),productController.addProduct)
router.get('/product/edit',adminSession.isLogin,productController.productEdit)
router.get('/product-block',adminSession.isLogin,productController.productBlock)
router.post('/edit',adminSession.isLogin,upload.array('image',12),productController.postProductEdit)
router.get('/product-delete',adminSession.isLogin,productController.productDelete)

// Coupon management
router.get('/coupon',adminSession.isLogin,couponController.couponManage)
router.post('/coupon',adminSession.isLogin,couponController.addCoupon)
router.get('/coupon-block',adminSession.isLogin,couponController.block)

// Order management
router.get('/order',adminSession.isLogin,orderController.orderManage)
router.post('/order',adminSession.isLogin,orderController.orderUpdate)
router.get('/order/view:id',adminSession.isLogin,orderController.viewOrder)

// Banner management
router.get('/banner',adminSession.isLogin,bannerController.bannerManage)
router.post('/banner',adminSession.isLogin,upload.array('image',12),bannerController.addBanner)
router.get('/banner_block',adminSession.isLogin,bannerController.bannerBlock)

// Sales section
router.get('/sales',adminSession.isLogin,salesController.salesPage)
router.post('/sales',adminSession.isLogin,salesController.postPDFData)
router.get('/csv_download',adminSession.isLogin,salesController.csvDownload)








module.exports=router
