module.exports.Home = function(req, res){
    res.status(200).json({
        success:true,
        name:'Shashank Dutt',
        Age:25
    })
}