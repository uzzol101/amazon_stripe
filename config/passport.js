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
    User.findOne({ email: email }, (err, user) => {
        if (err) {
            return done(err);
        }

        if (!user) {
            req.flash("error", "User not found");
            return done(null, false);
        }

        if (!user.comparePassword) {
            req.flash("error", "password do not match");
            return done(null, false)
        }

        return done(null, user);
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