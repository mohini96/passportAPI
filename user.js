var mongoose=require("mongoose");
const validator=require("validator");
const jwt=require('jsonwebtoken');
const _=require('lodash');
const bcrypt=require('bcryptjs');

//userschema
var userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:`{VALUE} is not a valid email`
        }
    },username:{
        type:String
    },
    password:{
        type:String,
        trim:true,
    },
    tokens:[{
        access:{
            type:String,
            require:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});
//Method
userSchema.methods.generateAuthToken=function ( ) {
    var user=this;
    var access='auth';
    var token=jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    });
};
userSchema.statics.findByToken=function (token) {
    var User = this;
    var decoded;
    try{
        decoded=jwt.verify(token,'abc123');
    }catch (e){
        // return Promise.reject();
        console.log("Error : " ,e)
    }
  return User.findOne({
     '_id':decoded._id,

     'tokens.token':token,
      'tokens.access':'auth'
  });
};
userSchema.pre('save',function (next) {
    var user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
             user.password=hash;
             next();
            });
        });

    }else{
        next();
    }
});
userSchema.statics.findByCredential=function (email,password) {
    var User=this;

        return User.findOne({email}).then((user)=>
        {
            console.log("Reject User : " ,user)
           return Promise.reject();

       return new Promise((resolve,reject)=>
       {
           bcrypt.compare(password,user.password,(err,res) => {
               if(res)
               {
                   resolve(user)
               }
               else
               {
                   reject();

               }

           });
       });
    })
};
//user
const User = mongoose.model('User',userSchema);
// var user=new User({
//     email:"mohini.patel@gmail.com"
// });
// user.save().then((doc)=>{
//     console.log('Saved todo',doc);
// },(e)=>{
//     console.log('Unable to save todo',e);
// });
module.exports={User};