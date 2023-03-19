const stripe = require('stripe')(process.env.Secret_key)
const Razorpay = require('razorpay')

exports.sendStripeKey = async function (req, res, next) {
    res.status(200).json({
        stripeKey: process.env.Publishable_key
    })
}

exports.captureStripePayment = async function (req, res, next) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',
    });

    //optionals

    metadata: { integration_check: 'accept_a_payment' }

    res.status(200)
        .json({
            success: true,
            client_secret: paymentIntent.client_secret
        })
}

exports.razorpaykey = async function (req, res, next) {
    res.status(200).json({
        razorpaykey: process.env.key_id
    })
}

exports.razorpayPayment = async function (req, res) {
    var instance = new Razorpay({ key_id: process.env.key_id, key_secret: process.env.key_secret })

    var options = {
        amount: req.body.amount,
        currency: "INR",
        notes: {
            key1: "value3",
            key2: "value2"
        }
    }
    const myOrder = await instance.orders.create(options)

    res.status().json({
        success:true,
        amount:req.body.amount,
        order:myOrder
    })
}