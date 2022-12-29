const express=require('express')
const router=express.Router()
const adminController=require('../Controller/admin/adminController')
const categoryController=require('../Controller/admin/categoryController')
const customerController=require('../Controller/admin/customerController')
const productController=require('../Controller/admin/productController')
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

router.post('/addproduct',adminSession.isLogin,upload.single('image'),productController.addProduct)

router.get('/product/edit',adminSession.isLogin,productController.productEdit)

router.get('/product-block',adminSession.isLogin,productController.productBlock)

router.post('/edit',adminSession.isLogin,upload.single('image'),productController.postProductEdit)

router.get('/product-delete',adminSession.isLogin,productController.productDelete)



module.exports=router
