var express = require('express');
var Category = require("../models/category");
var Product = require("../models/product");
var User = require("../models/user");
var Cart = require("../models/cart");
var router = express.Router();
var async = require("async");
var stripe = require("stripe")(
    "sk_test_3Z0OYGthzRXVWqzvY38kcZ01"
);

// Product.createMapping(function(err, mapping) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Mapping created ");
//         console.log(mapping);
//     }
// });

// var stream = Product.synchronize();
// var count = 0;

// stream.on("data", () => {
//     count++;
// });


// stream.on("close", () => {
//     console.log("Indexed " + count + "Documents");
// });


// stream.on("err", () => {
//     console.log(err);
// });
// elastic search 

router.post("/search", (req, res, next) => {
    res.redirect("/search?q=" + req.body.q);
});

router.get("/search", (req, res, next) => {
    if (req.query.q) {
        Product.search({
            query_string: { query: req.query.q }
        }, (err, results) => {
            if (err) return next(err);
            var data = results.hits.hits.map((hit) => {
                return hit;
            });

            res.render("search-results", { query: req.query.q, data: data });
        });
    }
});


function paginate(req, res, next) {

    var perPage = 9;
    var page = req.params.page;
    var products =
        Product
        .find()
        .skip(perPage * page)
        .limit(perPage);
    // total number of documents in database    
    var totalCount = Product.count();

    Promise.all([products, totalCount]).then((results) => {
        res.render("pagination", { products: results[0], totalPage: results[1] % perPage })
    });




}


/* GET home page. */
router.get('/', function(req, res, next) {

    if (req.user) {
        paginate(req, res, next);
    } else {
        res.render("index");
    }

});


// pagination 

router.get("/page/:page", (req, res, next) => {
    paginate(req, res, next);
});

router.get('/category', function(req, res, next) {
    res.render("category");
});



router.post('/category', function(req, res, next) {
    var category = new Category();
    category.name = req.body.name;
    category.save((err, cate) => {
        if (err) {
            return next(err);
        } else {
            req.flash("success", "New category added");
            res.redirect("/");
        }
    });
});



router.get("/product/:id", isAuth, (req, res, next) => {
    Product
        .findById(req.params.id, (err, prod) => {
            if (err) return next(err);
            res.render("product-details", { prod: prod });
        });

});

// cart route

router.get("/cart", (req, res, next) => {

    Cart.findOne({ owner: req.user._id }).populate("items.item").exec((err, foundcart) => {
        if (err) return next(err);
        //res.json(foundcart);
        res.render("cart", { foundcart: foundcart });
    });
});
// remove cart
router.post("/cart/:id", (req, res, next) => {
    var id = req.params.id;
    console.log(id);


    Cart.findOne({ owner: req.user._id }, (err, cart) => {
        if (err) {
            console.log("Can't find cart");
        }

        cart.items.pull({ _id: id });
        cart.save((err, saved) => {
            if (err) {
                console.log("can't save cart");
            } else {
                res.redirect("/cart");
            }
        });
    });
});




// add cart route

router.post("/cart", (req, res, next) => {


    Cart.findOne({ owner: req.user._id }, (err, cart) => {
        console.log(req.body.total);
        cart.items.push({
            item: req.body.product_id,
            price: parseFloat(req.body.total),
            quantity: parseInt(req.body.quantity)
        });

        cart.total = (parseFloat(req.body.total)).toFixed(2);

        cart.save((err) => {
            if (err) return next(err);
            res.redirect("back");

        });
    });

});

router.post("/payment", (req, res, next) => {
    var stripToken = req.body.stripeToken;
    var currentCharges = parseInt(req.body.totalCharge);
    stripe.customers.create({
        source: stripToken // obtained with Stripe.js
    }).then((customer) => {
        return stripe.charges.create({
            amount: currentCharges * 100,
            currency: "usd",
            customer: customer.id

        })
    }).then((charge) => {
        async.waterfall([
            function(callback) {
                Cart.findOne({ owner: req.user._id }, (err, cart) => {
                    callback(err, cart)
                })
            },

            function(cart, callback) {
                console.log(cart);
                User.findOne({ _id: req.user._id }, (err, user) => {
                    if (user) {
                        for (var i = 0; i < cart.items.length; i++) {
                            user.history.push({
                                item: cart.items[i].item,
                                paid: cart.items[i].price
                            })
                        }
                        user.save((err, user) => {
                            callback(err, user);
                        })
                    }
                })
            },

            function(user, callback) {
                Cart.update({ owner: req.user._id }, { $set: { items: [], total: 0 } }, (err, update) => {
                    if (update) {
                        res.redirect("/");
                    }
                })
            }

        ]);
    })


})



module.exports = router;

// Cart.find({}, (err, cart) => {
//     console.log(cart);
// })
function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/users/login");
    }

}

// User.find({}, (err, user) => {
            //     console.log(user);
            // })