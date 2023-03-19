const mongoose = require('mongoose')

const {Schema} = mongoose

const ProductSchema = new Schema({
    name:{
        type:String,
        required:[true, 'Field is mendatory'],
        trim:true
    },
    price:{
        type:Number,
        required:[true, 'Please provide product price']
    },
    description:{
        type:String,
        required:[true, 'Please Product product description']
    },
    imgs:[
        {
            url:String, //secure url
            filename:String // id
        }
    ],
    categories:{
        type:String,
        required:[true, 'Please provide category'],
        enum:{
            values:[
                'shortsleeves',
                'longsleeves',
                'sweatshirt',
                'hoodies'
            ],
            message:'Please Select category'
        }
    },
    brand:{
        type:String,
        required:[true, 'please add a brand for clothing']
    },
    rating:{
        type:Number,
        default:0
    },
    numberofReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:'user',
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:[true]
            }
        }
    ],
    user:{
        type:Schema.Types.ObjectId,
        ref:'user',
    },
    createdAt:{
        type: Date,
        default:Date.now
    }
})


module.exports = mongoose.model('product', ProductSchema)