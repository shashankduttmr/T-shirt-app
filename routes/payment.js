const express = require('express')
const Router = express.Router()
const {razorpaykey, razorpayPayment, sendStripeKey, captureStripePayment} = require('../controllers/payment')
const {isLoggedin, customRole} = require('../middlewares/isloggedin')

Router.route('/stripekey')
    .get(isLoggedin, sendStripeKey)

Router.route('/razorpaykey')
    .get(isLoggedin, razorpaykey)



Router.route('/stripepayment')
    .post(isLoggedin, captureStripePayment) 
    
Router.route('/razorpaypayment')
    .post(isLoggedin, razorpayPayment)



module.exports = Router