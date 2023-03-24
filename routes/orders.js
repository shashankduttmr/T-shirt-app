const express = require('express')
const Router = express.Router()
const {createOrder, GetOneUserOrder, AdminGetAllOrders, GetOneOrder} = require('../controllers/Orders')
const {isLoggedin, customRole} = require('../middlewares/isloggedin')

Router.route('/product/:id/create/order')
    .post(isLoggedin, createOrder)



Router.route('/admin/orders')
    .get(isLoggedin, customRole('Admin'), AdminGetAllOrders)




Router.route('/order/:id')
    .get(isLoggedin, GetOneOrder)



Router.route('/myorder')
    .get(isLoggedin, GetOneUserOrder)



module.exports = Router