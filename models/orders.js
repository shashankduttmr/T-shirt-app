const mongoose = require('mongoose')

const {Schema} = mongoose

const MyOrders = new Schema({
    shippingaddress:{
        type:String,
        required:[true]
    },
    
})













// Shipping Information {},
// User,
// Payment's info{},
// Tax Amount,
// Shipping Amount,
// Total Amount,
// Order Status
// Created At
// ------------------------
// orderItem:[{}]
// - name
// quantity
// Image[0]
// price
// Product