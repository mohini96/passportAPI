
var mongoose=require("mongoose");

var url = 'mongodb://localhost:27017/myproject';

mongoose.connect(url).then((res)=>{console.log("connected")}).catch((err)=>{console.log(err);});
module.exports = {mongoose}

