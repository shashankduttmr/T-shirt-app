const mongoose = require('mongoose')

module.exports.Connection = function(){
    mongoose.set('strictQuery', true)
    mongoose.connect(process.env.dburl)
        .then(function(){
            console.log('Connected');
        })
        .catch(function(){
            console.log('Failed to connect');
        })
}