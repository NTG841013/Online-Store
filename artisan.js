if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)

    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }
}


function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}


function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()

}

//Add price, title and image to the cart
function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

//update the cart and add VAT
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    var vat = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('R', ''))
        var quantity = quantityElement.value

        vat = (total + (price * quantity)) * 0.15
        total = total + (price * quantity) + vat

        localStorage.setItem('total', total)
    }
    total = Math.round(total * 100) / 100


    document.getElementsByClassName('cart-total-price')[0].innerText = 'R' + total
    document.getElementsByClassName('cart-vat-amount')[0].innerText = 'R' + vat

}
//discount load meassger
function discountAlert() {
    alert("Purchase items to the value of R5000 and receive a discount on your purchase!!")
}

//Get total from local storage
let orderTotal = localStorage.getItem('total')


function showOrder() {
    document.getElementById("orderTotal").innerHTML = "R" + orderTotal
    if (orderTotal == null) {
        document.getElementById("orderTotal").innerHTML = "R" + 0
    }
}

//get discount amount
function discountCoupon() {
    let discount = 0
        //5% discount for oders > R5000
    if (orderTotal > 5000) {
        let discount = orderTotal * 0.05
        document.getElementById('discount').innerHTML = "R" + discount;
    } else {
        document.getElementById('discount').innerHTML = "R" + discount;
    }

    let discountedAmount = parseFloat(orderTotal - (orderTotal * 0.05)).toFixed(2)
    localStorage.setItem('discount', discountedAmount)
}

//get delivery amount
function deliveryOption() {
    let del = document.getElementById('order-delivery').value;
    if (del === "Delivery") {
        localStorage.setItem('delOption', 200)
    } else {
        localStorage.setItem('delOption', 0)
    }
}

//Get total amount including discounts
function getTotal() {
    let total = JSON.parse(localStorage.getItem('total'));
    let discount = JSON.parse(localStorage.getItem('discount'));
    let delOption = JSON.parse(localStorage.getItem('delOption'));

    let totalPackage = parseFloat(total + discount + delOption).toFixed(2);
    document.getElementById('totalAmount').innerHTML = "R" + totalPackage;

}

//Confirm order and clear the local storage
function confirmation() {
    let ref = Math.random().toString(36).substr(2, 9);
    alert("Your order is on the way! Thank you for supporting local. Your reference number is: " + ref)
    localStorage.clear()
}