const express=require('express')
const router=express.Router()
const adminController=require('../Controller/adminController')

router.get('/adminLogin',adminController.adminLogin)

router.post('/adminLogin',adminController.adminVerification)

router.get('/adminHome',adminController.adminHome)

router.get('/adminUserManage',adminController.adminUserManage)

router.get('/adminProductManage',adminController.adminProductManage)


module.exports=router
