const express = require('express')

const Router = express.Router()
const {addProduct, 
    GetAllProduct, 
    AdminGetAllProduct, 
    getOneProduct,
    AdminUpdateProduct,
    DeleteOneProduct,
    AddReview,
    deleteReview,
    getOnlyReviewsForOneProduct
    } = require('../controllers/Product')
const {isLoggedin, customRole} = require('../middlewares/isloggedin')


//admin routes
Router.route('/admin/product/add')
    .post(isLoggedin,customRole('Admin') ,addProduct)

Router.route('/admin/products')
    .get(isLoggedin, customRole('Admin'), AdminGetAllProduct)


Router.route('/admin/product/:id/')
    .put(isLoggedin, customRole('Admin'), AdminUpdateProduct)
    .delete(isLoggedin, customRole('Admin'), DeleteOneProduct)



//normal user 
Router.route('/product/:id')
    .get(getOneProduct)


Router.route('/products')
    .get(isLoggedin, GetAllProduct)

Router.route('/product/:productid/review')
    .put(isLoggedin, AddReview)
    .delete(isLoggedin, deleteReview)


// Routes for reviews

Router.route('/reviews')
    .get(isLoggedin, getOnlyReviewsForOneProduct)


module.exports = Router