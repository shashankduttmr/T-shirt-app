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
        next(new AppError('Failed to place order', 404))
    }
}

exports.GetOneUserOrder = async function(req, res, next){
    try {
        const order = await orders.findOne({user:req.user._id}).populate("user","name email")

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
        next(new AppError('Orders not found', 500))
    }
}

exports.GetOneOrder = async function(req, res, next){
    try {
        const {id} = req.params

        if(!id) return next(new AppError('Transaction ID is mussing', 404))

        const order = await orders.findById(id)

        if(!order) return next(new AppError('Order not available', 404))

        res.status(200).json({
            success:true,
            order
        })

    } catch (error) {
        next(new AppError(error, 500))
    }
}

exports.AdminUpdateOrder = async function(req, res, next){
    try {
        const {id} = req.params

        if(!id) return next(new AppError('order id is missing', 404))

        const order = await orders.findById(id)

        if(!order) return next(new AppError('Oders not found', 404))

        if(order.orderStatus === 'Delivered'){
            return next(new AppError('order is already delivered', 404))
        }

        order.orderStatus = req.body.orderStatus

        order.orderItem.forEach(async product=>{
            await updateProductStock(product.product, product.quantity)
        })

        await order.save()

        res.status(200).json({
            success:true,
            order
        })

    } catch (error) {
        next(new AppError(error, 500))   
    }
}


exports.AdminDeleteOrder = async function(req, res, next){
    const {id} = req.params
    if(!id) return next(new AppError('failed to process the orders', 404))

    const order = await orders.findById(id)

    if(!order) return next(new AppError('Order not found', 404))

    await order.remove()

    res.status(200).json({
        success:true
    })
}

async function updateProductStock(productID, quantity, next){
    const product = await Product.findById(productID)

    if(product.stock < quantity){
        return next(new AppError('quantity is out of bound', 500))
    }

    product.stock = product.stock - quantity

    await product.save({validateBeforeSave:false})
}