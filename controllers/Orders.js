const orders = require('../models/orders')
const Product = require('../models/Product')
const AppError = require('../error')

exports.createOrder = async function(req, res, next){
    try {
        const {
            shippingInfo,
            orderItem,
            paymentInfo,
            taxAmount,
            shippingAmount,
            totalAmount,
        } = req.body

        const order1 = new orders({
            shippingInfo,
            orderItem,
            paymentInfo,
            taxAmount,
            shippingAmount,
            totalAmount,
        })

        await order1.save()

        res.status(200).json({
            success:true,
            order1
        })


    } catch (error) {
        next(new AppError('Failed to place order', 404))
    }
}