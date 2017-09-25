var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("../models/user");



//serialize and deserialize 
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// middleware
passport.use("local-login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
}, function(req, email, password, done) {
    console.log(email);
    User.findOne({ email: email }, (err, user) => {
        if (err) {
            return done(err);
        }
        console.log(user);

        if (!user) {
            req.flash("error", "User not found");
            return done(null, false);
        }



        user.comparePassword(password).then((isMatch) => {

            if (isMatch) {

                return done(null, user);
            } else {

                return done(null, false)
            }
        });


    });
}));

// custom validate function

module.exports = isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/users/login");
    }

}