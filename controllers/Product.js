const Product = require('../models/Product')
const User = require('../models/User')
const AppError = require('../error')
const cloudinary = require('cloudinary').v2
const WhereClause = require('../utils/WhereClause')

exports.addProduct = async function (req, res, next) {
    try {
        const product = new Product(req.body)

        const { name, price, description, categories, brand } = req.body

        if (!(name && price && description && categories, brand)) return next(new AppError('All fields are required budy', 500))

        if (req.files) {
            let ImgArray = new Array();

            if (req.files.imgs) {
                for (let x = 0; x < req.files.imgs.length; x++) {
                    let result = await cloudinary.uploader.upload(req.files.imgs[x].tempFilePath)
                    ImgArray.push({ url: result.secure_url, filename: result.public_id })
                }
                product.imgs = ImgArray
            }
        }
        product.user = req.user._id
        await product.save()

        res.status(200)
            .json({
                success: true,
                product
            })
    } catch (error) {
        console.log(error);
        next(new AppError(error, 500))
    }
}

exports.GetAllProduct = async function (req, res, next) {
    try {

        const resultPerPage = 6

        const countProduct = await Product.countDocuments()

        const productObj = new WhereClause(Product.find(), req.query)
            .search().filter()

        let products = await productObj.base

        const filteredProductNumber = products.length

        productObj.pager(resultPerPage)

        products = await productObj.base.clone()

        res.status(200).json({
            success: true,
            products,
            filteredProductNumber,
            countProduct
        })
    } catch (error) {
        next(new AppError(error, 500))
    }
}

exports.AdminGetAllProduct = async function (req, res, next) {
    try {
        const product = await Product.find()

        if (!product) return next(new AppError('Products not found', 404))

        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        return next(new AppError(error, 500))
    }
}

exports.getOneProduct = async function (req, res, next) {
    try {
        const { id } = req.params

        if (!id) return next(new AppError('Invalid Params', 404))

        const product = await Product.findById(id)

        console.log(product);

        if (!product) return next(new AppError('Product not found', 404))

        res.status(200).json({
            success: true,
            product
        })

    } catch (error) {
        next(new AppError(error, 500))
    }
}

exports.AdminUpdateProduct = async function (req, res, next) {
    try {
        const { id } = req.params

        let ImageArray = new Array()

        if (!id) return next(new AppError('Token ID is missing', 404))

        const product = await Product.findById(id)

        if (!product) return next(new AppError('PRoduct not found', 404))

        if (req.files) {

            //destroy the existing image

            for (let x = 0; x < product.imgs.length; x++) {
                await cloudinary.uploader.destroy(product.imgs[x].filename)
            }

            //upload and save the images

            for (let x = 0; x < req.files.photo.length; x++) {
                let result = await cloudinary.uploader.upload(req.files.photo[x].tempFilePath)
                ImageArray.push({ url: result.secure_url, filename: result.public_id })
            }
        }
        req.body.imgs = ImageArray

        await Product.findByIdAndUpdate(id, req.body, {
            runValidators: true,
            new: true,
        })

        res.status(200).json({
            success: true,
            edit: true
        })


    } catch (error) {
        next(new AppError(error, 500))
    }
}

exports.DeleteOneProduct = async function (req, res, next) {
    try {
        const { id } = req.params

        if (!id) return next(new AppError('Invalid ID', 500))

        const product = await Product.findById(id)

        if (!product) return next(new AppError('Product not found', 404))

        if (product.imgs) {
            for (let x = 0; x < product.imgs.length; x++) {
                await cloudinary.uploader.destroy(product.imgs[x].filename)
            }
        }

        await Product.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            delete: true
        })

    } catch (error) {
        next(new AppError(error, 500))
    }
}

exports.AddReview = async function (req, res, next) {
    try {
        const { productid } = req.params

        const { rating, comment } = req.body

        if (!(rating && comment)) return next(new AppError('Failed to post rating', 500))

        const product = await Product.findById(productid)

        if (!product) return next(new AppError('Product not found', 404))

        const { id } = req.user

        if (!id) return next(new AppError('User token is missing', 404))

        const user = await User.findById(id)

        if (!user) return next(new AppError('User not found'))

        const review = {
            user: req.user.id,
            name: req.body.name,
            rating: Number(rating),
            comment,
        }

        const AlreadyReviewed = product.reviews.find(rev => rev.user.toString() === req.user.id.toString())

        if (AlreadyReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === req.user.id.toString()) {
                    review.comment = comment
                    review.rating = rating
                }
            })
        } else {
            product.reviews.push(review)
            product.numberofReviews = product.reviews.length
        }

        //adjust ratings//

        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        await product.save({ validateBeforeSave: false })
        res.status(200).json({
            success: true
        })


    } catch (error) {
        return next(new AppError('Failed to post rating', 500))
    }
}

exports.deleteReview = async function(req, res, next){
    try {
        const { productid } = req.params

        const product = await Product.findById(productid)

        if (!product) return next(new AppError('Product not found', 404))

        const { id } = req.user

        if (!id) return next(new AppError('User token is missing', 404))

        const user = await User.findById(id)

        if (!user) return next(new AppError('User not found'))

        const reviews = product.reviews.filter(
            (rev)=>{
                rev.user.toString() !== req.user.id.toString()
            }
        )

        console.log(reviews);

        const numberofReviews = product.reviews.length

        //adjust ratings//

        const rating = product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        await Product.findByIdAndUpdate(productid, {
            reviews,
            rating,
            numberofReviews
        },{
            new:true,
            runValidators:true,
        })
        res.status(200).json({
            success: true
        })
    } catch (error) {
        next(new AppError(error, 500))
    }
}

exports.getOnlyReviewsForOneProduct = async function(req, res, next){
    try {
        const {id} = req.params

        if(!id)return next(new AppError('Invalid token', 404))

        const product=  await Product.findById(id)

        if(!product)return next(new AppError('product not found', 404))

        res.status(200).json({
            success:true,
            reviews:product.reviews
        })
    } catch (error) {
        next(new AppError(error, 500))
    }
}