var Cart = require("../models/cart");


module.exports = function(req, res, next) {

    if (req.user) {
        var total = 0;
        Cart.findOne({ owner: req.user._id }, (err, cart) => {
            console.log("Cart from middleware");

            // res.locals.cart = 2000;

            if (cart) {
                for (var i = 0; i < cart.items.length; i++) {
                    total += cart.items[i].price;
                }
                res.locals.cart = total;


            } else {
                res.locals.cart = 20;
            }

        });

        next();

    } else {
        console.log("No user loged in");

        next();
    }
}