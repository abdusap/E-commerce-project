const express=require('express')
const router=express.Router()
const userController=require('../Controller/userController')


router.get('/login',userController.login)

router.post('/login',userController.userVerfication)

router.get('/signup',userController.signup)

router.post('/signup',userController.userRegister)

module.exports=router