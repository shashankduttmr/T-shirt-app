const express = require('express')

const Router = express.Router()
const Home = require('../controllers/home')

Router.route('/')
    .get(Home.Home)

module.exports = Router