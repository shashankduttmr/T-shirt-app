const express = require('express')
const Router = express.Router()
const {createOrder, GetOneUserOrder, AdminGetAllOrders, GetOneOrder, AdminUpdateOrder, AdminDeleteOrder} = require('../controllers/Orders')
const {isLoggedin, customRole} = require('../middlewares/isloggedin')

Router.route('/product/:id/create/order')
    .post(isLoggedin, createOrder)

Router.route('/order/:id')
    .get(isLoggedin, GetOneOrder)

Router.route('/myorder')
    .get(isLoggedin, GetOneUserOrder)

 // Admin Routes//   

 Router.route('/admin/orders')
    .get(isLoggedin, customRole('Admin'), AdminGetAllOrders)


Router.route('/admin/order/:id')
    .put(isLoggedin, customRole('Admin'), AdminUpdateOrder)
    .delete(isLoggedin, customRole('Admin'), AdminDeleteOrder)





module.exports = Router