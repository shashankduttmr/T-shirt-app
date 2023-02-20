const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please provide a name']
    },
    email:{
        type:String,
        required:[true, 'Email is required'],
        validate:[validator.default.isEmail, 'Please enter email in correct formate'],
        unique:[true, 'Email might be registered already']
    },
    password:{
        type:String,
        required:[true, 'Password is must'],
    },
    role:{
        type:String,
        default:'user'
    },
    photo:{
        id:{
            type:String,
        },
        secure_url:{
            type:String,
        }
    },
    forgetPasswordToken:String,
    forgetPasswordExpiry:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})


UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
})

//validate the password with user password
UserSchema.methods.ValidatePassword = async function(userPassword){
    return await bcrypt.compare(userPassword, this.password)
}


//Creating JWT token
UserSchema.methods.getToken = function(){
    return jwt.sign({
        id:this._id
    }, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_expiry
    })
}


//generate forget password token(String)
UserSchema.methods.getForgetPasswordToken = function(){
    // generate a long and random String
    const id = crypto.randomBytes(20).toString('hex')

    //getting a hash
    this.forgetPasswordToken = crypto.createHash('sha256').update(id).digest('hex')

    //time of token expiry //
    this.forgetPasswordExpiry = Date.now() * 20*60 * 1000
    console.log(this.forgetPasswordExpiry);

    return id
}

module.exports = mongoose.model('user', UserSchema)