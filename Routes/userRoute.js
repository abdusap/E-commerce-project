const express = require("express");
const router = express.Router();
const user = require("../Controller/user/userContoller");
const product = require("../Controller/user/productController");
const shop = require("../Controller/user/shopController");
const session = require("../Middleware/userSession");

// Login and signup section
router.get("/login", session.isLogout, user.login);
router.post("/login", session.isLogout, user.userVerfication);
router.get("/signup", session.isLogout, user.signup);
router.post("/signup", session.isLogout, user.userRegister);
router.get("/otp", session.isLogout, user.otp);
router.post("/otpVerification", session.isLogout, user.otpVerification);

// Home section
router.get("/", user.home);

// Profile section
router.get("/profile", session.isLogin, user.profile);
router.post("/add-address", session.isLogin, user.addressAdd);
router.get("/profile/address-edit", session.isLogin, user.addressEdit);
router.post("/addressedit", user.postAddressEdit);
router.get("/address-delete", session.isLogin, user.addressDelete);
router.get("/address-default", session.isLogin, user.addressDefualt);
router.post("/profileedit", session.isLogin, user.profileEdit);
router.get("/order", session.isLogin, user.orderPage);
router.get("/order/view_orders", session.isLogin, user.viewOrderDetails);
router.get("/order/cancel_orders", session.isLogin, user.cancelOrder);

// Product section
router.get("/product", product.productPage);
router.post('/product',product.search)
router.get("/product-details", product.productDetails);

// Cart section
router.get("/cart", session.isLogin, shop.userCart);
router.post("/add_to_cart", session.isLogin, shop.addToCart);
router.patch("/productadd", session.isLogin, shop.productQtyAdd);
router.patch("/productsub", session.isLogin, shop.productQtySub);
router.delete("/cart", session.isLogin, shop.cartDelete);

// Checkout section
router.get("/checkout", session.isLogin, shop.checkOut);
router.post("/checkout", session.isLogin, shop.postCheckOut);
router.post("/coupon_check", session.isLogin, shop.couponCheck);
router.post("/verifyPayment", session.isLogin, shop.verifyPayment);

// Wishlist section
router.get("/wishlist", session.isLogin, shop.viewWishlist);
router.post("/addtowishlist", session.isLogin, shop.addWishlist);
router.delete("/wishlist",session.isLogin, shop.deleteWishlist)
router.post("/setaddress", session.isLogin, shop.setAddressCheckout);

// Payment success & fail section
router.get("/payment_succuss", session.isLogin, shop.paymentSuccess);
router.get("/payment_fail", session.isLogin, shop.paymentFail);

// Error page
router.get("/404", user.errorPage);
router.get("/500", user.error500Page);

// Logout section
router.get("/logout", session.isLogin, user.logout);

module.exports = router;
