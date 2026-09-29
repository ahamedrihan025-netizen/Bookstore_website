const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
cartIcon.addEventListener("click", ()=> cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));



// --- 1. NEW: Save to LocalStorage ---
const saveCart = () => {
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    let cartData = [];

    cartBoxes.forEach(cartBox => {
        cartData.push({
            title: cartBox.querySelector(".cart-product-title").textContent.trim(),
            price: cartBox.querySelector(".cart-price").textContent.trim(),
            imgSrc: cartBox.querySelector(".cart-img").src,
            quantity: cartBox.querySelector(".number").textContent
        });
    });

    localStorage.setItem("userCart", JSON.stringify(cartData));
};



// --- 2. NEW: Load from LocalStorage ---
const loadCart = () => {
    const savedCart = localStorage.getItem("userCart");
    if (savedCart) {
        const cartData = JSON.parse(savedCart);
        cartData.forEach(item => {
            // We use a modified version of your logic to rebuild the UI
            createCartElement(item.title, item.price, item.imgSrc, item.quantity);
        });
    }
};

const addCartButtons = document.querySelectorAll(".add-cart");
addCartButtons.forEach((button) => {
    button.addEventListener("click", event => {
        const productBox = event.target.closest(".product");
        addToCart(productBox);
    });
});

const cartContent = document.querySelector(".cart-content");
const addToCart = productBox =>{
    const productImgSrc = productBox.querySelector("img").src;
    const productTitle = productBox.querySelector(".book-title").textContent;
    const productPrice = productBox.querySelector(".book-price").textContent;

    const cartItems = cartContent.querySelectorAll(".cart-product-title");
    for (let item of cartItems) {
        if (item.textContent.trim()===productTitle.trim())
             {
            alert("This item is already in the cart.");
            return;
        }
    }

        createCartElement(productTitle, productPrice, productImgSrc, 1);
        saveCart(); // Save after adding
};

// --- 4. REFACTORED: Create Element Logic ---
// Moving this to a function allows loadCart and addToCart to share logic
const createCartElement = (title, price, imgSrc, quantity) => {
    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    cartBox.innerHTML = `
        <img src="${imgSrc}" class="cart-img"> 
        <div class="cart-detail"> 
            <h2 class="cart-product-title">${title}</h2> 
            <span class="cart-price">${price}</span> 
            <div class="cart-quantity"> 
                <button id="decrement">-</button> 
                <span class="number">${quantity}</span> 
                <button id="increment">+</button> 
            </div> 
        </div>  
        <img src="../logos/delete-bin-6-line.png" alt="Delete" class="cart-remove">`;

    cartContent.appendChild(cartBox);

    // Event Listeners for the new box
    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
        cartBox.remove();
        updateCartCount(-1);
        updateTotalPrice();
        saveCart(); // Save after removing
    });

    cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
        const numberElement = cartBox.querySelector(".number");
        let qty = parseInt(numberElement.textContent);

        if (event.target.id === "decrement" && qty > 1) {
            qty--;
            if (qty === 1){
                decrementButton.style.color = "#999";
            }
        } else if (event.target.id === "increment") {
            qty++;
            //decrementButton.style.color = "#333";
        }
        numberElement.textContent = qty;
        updateTotalPrice();
        saveCart(); // Save after quantity change
    });

    updateCartCount(1);
    updateTotalPrice();
};

const updateTotalPrice = () => {
    const totalPriceElement = document.querySelector(".total-price");
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    let total = 0;
    cartBoxes.forEach(cartBox => {
        const priceElement = cartBox.querySelector(".cart-price");
        const quantityElement = cartBox.querySelector(".number");
        const price = priceElement.textContent.replace("Rs."," ");
        const quantity = quantityElement.textContent;
        total += price * quantity;
    });
    totalPriceElement.textContent= `Rs${total}`;
};

let cartItemCount = 0;
const updateCartCount = change => {
const cartItemCountBadge = document.querySelector(".cart-item-count");
cartItemCount += change;
if (cartItemCount > 0) {
    cartItemCountBadge.style.visibility = "visible";
    cartItemCountBadge.textContent = cartItemCount;
} else {
    cartItemCountBadge.style.visibility = "hidden";
    cartItemCountBadge.textContent = "";
}

};

const buyNowButton = document.querySelector(".btn-buy");
buyNowButton.addEventListener("click", () => {
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    if (cartBoxes.length === 0) {
        alert("Your cart is empty.Please add items to your cart before buying.");
        return;
    }

    cartBoxes.forEach(cartBox => cartBox.remove());

    cartItemCount = 0;
    updateCartCount(0);

    updateTotalPrice();

    alert("Thank you for purchase!");
});





// --- 5. INITIALIZE ---
// Call this at the very bottom of your script
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
});

