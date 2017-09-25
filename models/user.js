var mongoose = require('mongoose');
var bcrypt = require("bcryptjs");
var Schema = mongoose.Schema;


var userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,

    profile: {
        name: { type: String, default: '' },
        picture: { type: String, default: '' }
    },
    address: String,
    history: [{
        date: Date,
        paid: { type: Number, default: 0 },
        item: { type: Schema.Types.ObjectId, ref: "Product" },
        paid: Number
    }]
});


// Hash the password before we even save it to database

userSchema.pre("save", function(next) {
    var user = this;
    if (!user.isModified()) {
        return next();
    } else {
        bcrypt.hash(user.password, 10, function(err, hash) {
            if (err) {
                return next(err);
            } else {
                user.password = hash;
                next();
            }
        });

    }
});


// compare password in the databse and the one that the user type in

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
}


var User = mongoose.model("User", userSchema);

module.exports = User;