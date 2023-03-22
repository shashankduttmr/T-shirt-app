const express = require('express')
const Router = express.Router()
const {createOrder} = require('../controllers/Orders')
const {isLoggedin} = require('../middlewares/isloggedin')

Router.route('/product/:id/create/order')
    .post(isLoggedin, createOrder)


module.exports = Router