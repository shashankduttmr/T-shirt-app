const mongoose = require('mongoose')

const {Schema} = mongoose

const MyOrders = new Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        PhoneNumber:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        postalcode:{
            type:Number,
            required:true
        },
        country:{
            type:String,
            required:true
        },
    },

    user:{
        type:Schema.Types.ObjectId,
        ref:'user',
    },

    orderItem:[
        {
            name:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
                required:true //quantity*price
            },
            product:{
                type:Schema.Types.ObjectId,
                ref:'Product',
                required:true
            }
        }
    ],
    paymentInfo:{
        id:{
            type:String
        }
    },
    taxAmount:{
        type:Number,
        required:true
    },
    shippingAmount:{
        type:Number,
        required:true
    },
    totalAmount:{
        type:Number,
        required:true
    },
    orderStatus:{
        type:String,
        required:true,
        default:'processing'
    },
    deliveredAt:{
        type: Date
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('order', MyOrders)


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