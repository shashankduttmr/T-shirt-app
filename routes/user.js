const express = require('express')
const Router = express.Router()
const {
    signUp, 
    Reg, 
    Login, 
    UserLogin, 
    Logout, 
    forgetPassword, 
    passwordReset, 
    dashboard, 
    changePassword,
    UpdateDetails
}    = require('../controllers/usercontrollers')
const {isLoggedin} = require('../middlewares/isloggedin')


Router.route('/signup')
    .get(Reg)
    .post(signUp)


Router.route('/login')
    .get(Login)
    .post(UserLogin)


Router.route('/logout')
    .get(Logout)


Router.route('/forgotPassword')
    .post(forgetPassword)   
    
    
Router.route('/password/reset/:token')
    .post(passwordReset)


Router.route('/dashboard')
    .get(isLoggedin, dashboard)

    
Router.route('/password/update')
    .post(isLoggedin, changePassword)


Router.route('/user/dashboard/update')
    .put(isLoggedin, UpdateDetails)




module.exports = Router