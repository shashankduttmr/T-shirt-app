const orders = require('../models/orders')
const Product = require('../models/Product')
const AppError = require('../error')

exports.createOrder = async function(req, res, next){
    try {
        const {id} = req.params

        if(!id) return next(new AppError('Product token is missing', 404))

        const product = await Product.findById(id)

        if(!product) return next(new AppError('product not available order failed', 404))
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
        console.log(error);
        next(new AppError('Failed to place order', 404))
    }
}