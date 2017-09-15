var mongoose = require("mongoose");
var mongoosastic = require("mongoosastic");
var Schema = mongoose.Schema;

var productSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    name: String,
    price: Number,
    image: String
});

productSchema.plugin(mongoosastic, {
    hosts: [
        "localhost:9200"
    ]
});



var Product = mongoose.model("Product", productSchema);

module.exports = Product;