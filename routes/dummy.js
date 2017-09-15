{
    _id: "59bb61318a1a3205c8e39d68",
    owner: "59bb61318a1a3205c8e39d67",
    __v: 7,
    total: 1180,
    items: [{
            item: {
                _id: "59ba9f131d3b4e05d8bb4027",
                image: "http://lorempixel.com/640/480/food",
                price: 713,
                name: "Sleek Granite Computer",
                category: "59ba9ee31d3b4e05d8bb3ff3",
                __v: 0
            },
            _id: "59bb613a8a1a3205c8e39d69",
            price: 713,
            quantity: 1
        },
        {
            item: {
                _id: "59ba9f131d3b4e05d8bb4022",
                image: "http://lorempixel.com/640/480/abstract",
                price: 295,
                name: "Awesome Metal Chicken",
                category: "59ba9ee31d3b4e05d8bb3ff3",
                __v: 0
            },
            _id: "59bb63d3ff80f5131822c6a0",
            price: 295,
            quantity: 4
        }
    ]
}





Cart.findOne({ owner: req.user._id }).populate("items.item").exec((err, cartItem) => {
    if (err) {
        console.log("error in cart route");
    } else {

        cartItem.items.push({
            item: req.body.product_id,
            price: parseFloat(req.body.total),
            quantity: parseInt(req.body.quantity)
        });

        cartItem.save().then((cart) => {

            cart.items.forEach((item) => {
                cartItem.total = item.item.price * cartItem.quantity;
                console.log("From inner cart item");


            });


        });


    }
});