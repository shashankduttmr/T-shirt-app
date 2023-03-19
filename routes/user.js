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
    UpdateDetails,
    adminAllUser,
    managerAllUser,
    adminOneUser,
    ModifyOnlyUser,
    DeleteOnlyUser
}    = require('../controllers/usercontrollers')
const {isLoggedin,customRole} = require('../middlewares/isloggedin')


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


// Admin Routes

Router.route('/admin/user')
    .get(isLoggedin,customRole('Admin') ,adminAllUser)

Router.route('/admin/user/:id')
    .get(isLoggedin, customRole('Admin'), adminOneUser)
    .put(isLoggedin, customRole('Admin'), ModifyOnlyUser)
    .delete(isLoggedin, customRole('Admin'), DeleteOnlyUser)


//Manager only routes

Router.route('/manager/user')
    .get(isLoggedin, customRole('manager'), managerAllUser)


module.exports = Router