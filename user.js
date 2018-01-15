var mongoose=require("mongoose");
var db=require("./mongoose");
const bcrypt=require('bcryptjs');

var UserDetail = new mongoose.Schema({
    email:String,
    username: String,
    password: String
});
//const user = mongoose.model('users', UserDetail);

UserDetail.methods.generateHash = (password) => {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
}

UserDetail.methods.validPassword = (password,ps) => {
    return bcrypt.compareSync(password,ps)
}

module.exports = mongoose.model('user', UserDetail);
// UserDetail.statics.findByCredential=function (email,password) {
//     var user=this;
//
//     return User.findOne({email}).then((user)=>
//     {
//         console.log("Reject User : " ,user)
//         return Promise.reject();
//
//         return new Promise((resolve,reject)=>
//         {
//             bcrypt.compare(password,user.password,(err,res) => {
//                 if(res)
//                 {
//                     resolve(user)
//                 }
//                 else
//                 {
//                     reject();
//
//                 }
//
//             });
//         });
//     })
// };

//user.find().then((res)=>{console.log(res)});
// module.exports={user}

