$(document).ready(function() {

    var quantity = $(".quantity");
    var numProd = $("#numProd");
    var totalPrice = $("#totalPrice");
    var totalVal = $("#total");
    var total = 0;
    var count = 0;
    $("#increment").click(function() {
        var price = parseInt($("#price").html());
        total += price;
        count++;
        quantity.html(count);
        totalPrice.val("$" + total);
        totalVal.val(total);
        numProd.val(count);

    });

    $("#decrement").click(function() {
        var price = parseInt($("#price").html());
        total -= price;
        count--;

        quantity.html(count);
        totalPrice.val(total);
        totalVal.val(total);
        numProd.val(count);

    });




});