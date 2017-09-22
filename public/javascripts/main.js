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




    var stripe = Stripe('pk_test_XU3tC204QPu6F3CADrLqoQXn');
    var elements = stripe.elements();

    var card = elements.create('card', {
        'style': {
            'base': {
                'fontFamily': 'Arial, sans-serif',
                'fontSize': '17px',
                'color': '#C1C7CD',
            },
            'invalid': {
                'color': 'red',
            },
        }
    });


    // Add an instance of the card UI component into the `card-element` <div>
    card.mount('#card-element');




    var stripeResponseHandler = function(status, response) {
        // Grab the form:
        var form = document.getElementById('payment-form');

        if (response.error) { // Problem!
            // Show the errors on the form:
        } else { // Token was created!
            // Get the token ID:
            var token = response.id;

            // Insert the token ID into the form so it gets submitted to the server
            var form = document.getElementById('payment-form');
            var hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'stripeToken');
            hiddenInput.setAttribute('value', token);
            form.appendChild(hiddenInput);

            // Submit the form
            form.submit();
        }
    };

    // Create a token when the form is submitted
    var form = document.getElementById('payment-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        Stripe.card.createToken(form, stripeResponseHandler);
    });


    function stripeTokenHandler(token) {
        // Insert the token ID into the form so it gets submitted to the server
        var form = document.getElementById('payment-form');
        var hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'stripeToken');
        hiddenInput.setAttribute('value', token.id);
        form.appendChild(hiddenInput);

        // Submit the form
        form.submit();
    }

    function createToken() {
        stripe.createToken(card).then(function(result) {
            if (result.error) {
                // Inform the user if there was an error
                var errorElement = document.getElementById('card-errors');
                errorElement.textContent = result.error.message;
            } else {
                // Send the token to your server
                stripeTokenHandler(result.token);
            }
        });
    };

    // Create a token when the form is submitted.
    var form = document.getElementById('payment-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        createToken();
    });


    card.addEventListener('change', function(event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });




});