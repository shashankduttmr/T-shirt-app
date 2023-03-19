const jwt = require('jsonwebtoken')
const AppError = require('../error')
const User = require('../models/User')


exports.isLoggedin = async function (req, res, next) {
    try {
        const token = req.cookies.token || req.header('Authorization').replace('Bearer ', '')
        if (!token) {
            return next(new AppError('You must be logged in to access this place', 404))
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const {id} = decoded
        if(!id) return next(new AppError('You must be logged in to access this place', 404))

        const user = await User.findById(id)
        if(!user) return next(new AppError('User not found', 404))
        req.user = user
        return next()

    } catch (error) {
        return next(new AppError('You must be logged in to access this place', 404))
    }
}

exports.customRole = (...roles)=>{
    return(req, res,next)=>{
        if(!roles.includes(req.user.role)) return next(new AppError('You are not allowed for this role', 403))
        return next()
    }
}