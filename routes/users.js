var express = require('express');
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var async = require("async");
var Cart = require("../models/cart");
var passportConfig = require("../config/passport");
//register new user
router.get('/register', function(req, res, next) {
    res.render("register");
});

router.post("/register", (req, res, next) => {

    async.waterfall([
        function(callback) {
            var user = new User();

            user.profile.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;
            // first save the user 
            user.save((err, user) => {
                if (err) return next(err);

                callback(null, user);
            });

        },
        function(user) {
            // user saved. give the user a cart

            var cart = new Cart();
            cart.owner = user._id;
            cart.save((err) => {
                if (err) return next(err);
                // now user have cart. login the user into session
                req.login(user, (err, user) => {
                    if (err) {
                        return next(err);
                    } else {
                        req.flash("success", "user created successfuly");
                        res.redirect("/");
                    }
                });
            });
        }
    ]);

});

router.get("/login", (req, res, next) => {
    if (req.user) {
        req.flash("success", "You are already in");
        res.redirect("/");
    } else {
        res.render('login');
    }
});

router.post("/login", passport.authenticate("local-login", { failureRedirect: "/login" }), (req, res, next) => {
    req.flash("success", "Welcome user");
    res.redirect("/");
});

router.get("/profile", isAuthenticated, (req, res, next) => {
    User.findById(req.user._id, (err, user) => {
        if (err) {
            return next(err);
        } else {
            res.send(user);
        }
    });
});


router.get("/logout", (req, res, next) => {

    req.logout();
    req.flash("success", "Loged you out")
    res.redirect("/users/login");
});

module.exports = router;



// Cart.find((err, user) => {
//     console.log(user);
// });

// User.remove((err, user) => {
//     console.log("all user removed");
// });