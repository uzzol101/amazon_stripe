var express = require("express");
var router = express.Router();
var async = require("async");
var faker = require("faker");
var Category = require("../models/category");
var Product = require("../models/product");

router.get("/:name", (req, res, next) => {
    async.waterfall([
        function(callback) {
            Category.findOne({ name: req.params.name }, (err, cate) => {
                if (err) return next(err);
                console.log(cate);
                callback(null, cate);
            });
        },
        function(cate, callback) {

            for (var i = 0; i < 30; i++) {
                var product = new Product();
                product.category = cate._id;
                product.name = faker.commerce.productName();
                product.price = faker.commerce.price();
                product.image = faker.image.image();

                product.save();
            }
        }
    ]);

    res.json({
        msg: " database seeding success"
    });
});

module.exports = router;




// Product.find({}, (err, prod) => {
//     console.log(prod);
// });

// Category.find({}, (err, prod) => {
//     console.log(prod);
// });



// Category.remove({}, (err, removed) => {
//     console.log("Database emptyed");
// });
// Product.remove({}, (err, removed) => {
//     console.log("Database emptyed");
// });