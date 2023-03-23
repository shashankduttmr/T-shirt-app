const orders = require('../models/orders')
const Product = require('../models/Product')
const AppError = require('../error')

exports.createOrder = async function(req, res, next){

    //contrller to create orders 
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

exports.GetOneOrder = async function(req, res, next){
    try {
        const {id} = req.params

        if(!id)return next(new AppError('Please Check your order details', 404))

        const order = await orders.findById(id).populate("user","name email")

        if(!order) return next(new AppError('Order not found', 404))

        res.status(200).json({
            success:true,
            order
        })
    } catch (error) {
        next(new AppError(error, 500))
    }
}

//admin controllers

exports.AdminGetAllOrders = async function(req, res, next){
    try {
        const AllOrders = await orders.find({})

        if(!AllOrders)return next(new AppError('Orders not found', 404))

        res.status(200).json({success:true,
        AllOrders})
    } catch (error) {
        
    }
}