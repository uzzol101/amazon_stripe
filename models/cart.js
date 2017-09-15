var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var cartSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    total: { type: Number, deault: 0 },
    items: [{
            item: { type: Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, default: 1 },
            price: { type: Number, default: 0 }
        }

    ]

});

module.exports = Cart = mongoose.model("Cart", cartSchema);