const User = require('../models/User')
const AppError = require('../error')
const cookieToken = require('../utils/cookietoken')
const cloudinary = require('cloudinary').v2
const mailHelper = require('../utils/emailhelper')
const crypto = require('crypto')


exports.signUp = async function (req, res, next) {
    try {
        const { name, email, password } = req.body
        let result
        if (req.files) {
            var files = req.files.photo
            result = await cloudinary.uploader.upload(files.tempFilePath, {
                folder: 'users',
            })
        }
        if (!(name && email && password)) {
            return next(new AppError('All the informations are mendatory', 500))
        }
        const extuser = await User.findOne({ email: email })
        console.log(extuser);
        if (extuser) {
            return next(new AppError('User Already registered', 404))
        }
        const user = await User.create({
            name: name,
            email: email,
            password: password,
            photo: {
                id: result.public_id,
                secure_url: result.secure_url
            }
        })
        console.log(result);

        cookieToken(user, res)

    } catch (error) {
        console.log(error);
        next(new AppError('Server is unHappy', 500))
    }
}

exports.Reg = function (req, res) {
    res.render('register')
}

exports.Login = function (req, res) {
    res.render('login')
}

exports.UserLogin = async function (req, res, next) {
    try {
        //checking user//
        const { email, password } = req.body
        if (!(email && password)) {
            return next(new AppError('All fields are mendatory', 404))
        }
        const user = await User.findOne({ email: email })
        if (!user) {
            return next(new AppError('User is not registered yet', 404))
        }
        const verify = await user.ValidatePassword(password)
        console.log(verify);
        if (!verify) {
            return next(new AppError('Invaild username or a password', 404))
        }

        return cookieToken(user, res)
    } catch (error) {
        next(new AppError('Failed to login', 500))
    }
}

exports.Logout = async function (req, res, next) {
    res.cookie('token', null), {
        expires: new Date(Date.now()),
        httpOnly: true
    }
    res.status(200).send({
        success: true,
        message: "Logout Success"
    })
}

exports.forgetPassword = async function (req, res, next) {
    try {
        //collecting email
        const { email } = req.body
        //check user enters email or not
        if (!email) return next(new AppError('Email field is required', 500))
        // checks user is in database or not
        const user = await User.findOne({ email: email })
        if (!user) {
            return next(new AppError('User you requested not present in our records', 404))
        }

        //get token from user model's model
        const forgetToken = user.getForgetPasswordToken()

        //save user fields in db
        await user.save({ validateBeforeSave: false })
        // making url
        const myURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgetToken}`

        //craft a message 
        const message = `Copy paste this url and hit enter ${myURL}`
        try {
            const h = await mailHelper({
                toEmail: user.email,
                Subject: 'forget password token',
                message: `${message}`
            })
            res.status(200).json({
                success: true,
                message: "mail sent"
            })
        } catch (error) {
            user.forgetPasswordToken = undefined
            user.forgetPasswordExpiry = undefined
            await user.save({ validateBeforeSave: false })
            return next(new AppError(error.message, 500))
        }

    } catch (error) {
        next(new AppError('Something went wrong', 404))
    }
}

exports.passwordReset = async function (req, res, next) {
    try {
        //grabing the token
        const { token } = req.params
        

        //check token present or not
        if (!token) {
            return next(new AppError('token is missing', 404))
        }

        // creating hash with given token from parameters
        const encryToken = crypto.createHash('sha256').update(token).digest("hex")

        const user = await User.findOne({
            encryToken,
            forgetPasswordExpiry: { $gt: Date.now() }
        })
        // if user not found
        if (!user) {
            return next(new AppError('Failed to update password', 404))
        }

        const { password, confirmpassword } = req.body

        // thrown a response when password is not equals to confirmpassword
        if (password !== confirmpassword) {
            return next(new AppError('Failed to update password', 500))
        }

        user.password = req.body.password
        user.forgetPasswordExpiry = undefined
        user.forgetPasswordToken = undefined
        await user.save()
        // cookieToken(user, res)
        res.status(200).json({
            success: true,
            isPasswordChange: true
        })

    } catch (error) {
        const { token } = req.params
        if (!token) {
            return next(new AppError('token is missing', 404))
        }
        const encryToken = crypto.createHash('sha256').update(token).digest('hex')
        await User.findOne({ encryToken }).findOneAndUpdate({ forgetPasswordExpiry: undefined, forgetPasswordToken: undefined })
        next(new AppError('Failed to change password', 500))
    }
}



exports.dashboard = async function (req, res, next) {
    const user = await User.findById(req.user._id)
    res.status(200)
        .json({
            success: true,
            user
        })
}


exports.changePassword = async function (req, res, next) {
    try {
        const userId  = req.user._id
        const user = await User.findById(userId).select("+password")

        if (!user) return next(new AppError('User not found', 404))

        const { oldpassword, password, confirmpassword } = req.body

        if (!(oldpassword && password && confirmpassword)) return next(new AppError('All fields are mendatory', 400))

        const verify = await user.ValidatePassword(oldpassword)

        console.log(verify);

        if (!verify) return next(new AppError('Failed to validate', 400))

        if (password !== confirmpassword) return next(new AppError('Password do not match', 404))

        user.password = password
        await user.save()

        return res.status(200).send({
            success:true,
            passwordUpdated:true
        })

    } catch (error) {
        return next(new AppError('Failed to update password', 500))
    }
}

exports.UpdateDetails = async function(req, res, next){
    try {
        const {_id} = req.user
        if(!_id) return next(new AppError('User not found and failed to update details', 404))

        const user = await User.findById(_id)

        if(!user) return next(new AppError('User not found', 404))
        const {name, email} = req.body

        if(!(name, email)) return next(new AppError('All the fields are mendatory', 404))

        if(req.files){
            const profile = await cloudinary.uploader.upload(req.files.profile.tempFilePath, {
                folder:'users'
            })
            user.photo = {
                id:profile.public_id,
                secure_url:profile.secure_url
            }
            await user.save()
        }
        if(req.body.deleteImage){
            await cloudinary.uploader.destroy(req.body.deleteImage)
            user.photo = undefined
            await user.save()
        }

        await User.findByIdAndUpdate(_id, req.body, {
            new:true,
            runValidators:true,
        })
        res.status(200).json({
            success:true,
            updated:true
        })
    } catch (error) {
        return next(new AppError('Failed to update the record', 500))
    }
}

exports.adminAllUser = async function(req, res, next){
    try {
        const users = await User.find({})
        console.log(users);
        res.status(200).json({
            success:true,
            users
        })
    } catch (error) {
        
    }
}

exports.managerAllUser = async function(req, res,next){
    try {
        const user = await User.find({role:'user'})
        if(!user)return next(new AppError('Failed to retrive data from database', 400))
        
    } catch (error) {
        
    }
}

exports.adminOneUser = async function(req, res, next){
    const {id} = req.params
    if(!id)return next(new AppError('Failed to fetch ID', 404))

    const user = await User.findById(id)
    if(!user)return next(new AppError('User not found', 404))

    res.status(200).json({
        success:true, 
        user
    })
}

exports.ModifyOnlyUser = async function(req, res, next){
    try {
        const {id} = req.params
        if(!id) return next(new AppError('Missing token', 404))

        const user = await User.findById(id)

        if(!user) return next(new AppError('User not found'))
        const details = {
            name:req.body.name,
            email:req.body.email,
            role:req.body.role
        }
        await User.findByIdAndUpdate(id, details, {
            runValidators:true,
        })
        res.status(200).json({
            success:true
        })
    } catch (error) {
        next(new AppError(error, 500))
    }
}

exports.DeleteOnlyUser = async function(req, res, next){
    try {
        const {id} = req.params

        if(!id)return next(new AppError('Missing Token', 404))

        const user = await User.findById(id)

        if(!user) return next(new AppError('User not found', 404))

        await User.findByIdAndDelete(id)

        return res.status(200).json({
            isUserDelete: true
        })
    } catch (error) {
        next(new AppError(error, 500))
    }
}