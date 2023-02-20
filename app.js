require('dotenv').config()
require('./configs/database').Connection()
const express = require('express')
const cloudinary  = require('cloudinary').v2
const morgan = require('morgan')
const YAML = require('yamljs')
const expressFileUpload = require('express-fileupload')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('docs/docs.yml')
const app = express()
const Home = require('./routes/home')
const user = require('./routes/user')
const cookieParser = require('cookie-parser')

cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.API_key,
    api_secret:process.env.api_secret
})


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(morgan('dev'))
app.use(expressFileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))
app.use(cookieParser('this is a secret'))


app.use('/', Home)
app.use('/api/v1', user)

app.use(function(err, req, res, next){
    const {message, status} = err
    res.status(status).send(message)
})

module.exports = app