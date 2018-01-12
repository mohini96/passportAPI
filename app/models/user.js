
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});


userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
}

userSchema.methods.validPassword = (password,ps) => {
    return bcrypt.compareSync(password,ps)
}



module.exports = mongoose.model('User', userSchema);