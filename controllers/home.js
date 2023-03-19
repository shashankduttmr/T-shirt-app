module.exports.Home = function(req, res){
    console.log(process.env);
    res.status(200).json({
        success:true,
        name:'Shashank Dutt',
        Age:25
    })
}