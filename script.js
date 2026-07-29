// =====================================
// A.U SHOP SCRIPT
// PART 1
// =====================================

// Cart Data
let cart = JSON.parse(localStorage.getItem("cart")) || [];



// =====================================
// ADD TO CART
// =====================================

function addCart(productName, productPrice, productqty) {

    const product = {
        name: productName,
        price: productPrice,
        qty: productqty
    };

    cart = [product];

    localStorage.setItem("cart", JSON.stringify(cart));

    showToast("✅ Product added to cart!");

setTimeout(() => {

    window.location.href = "checkout.html";

}, 800);
}

// =====================================
// SEARCH SYSTEM
// =====================================

function searchProduct() {

    let input = document
        .getElementById("searchBox")
        .value
        .toLowerCase()
        .trim();

    let resultBox = document.getElementById("searchResults");

    resultBox.innerHTML = "";

    if (input === "") return;

    let results = productList.filter(product =>
        product.toLowerCase().includes(input)
    );

    if (results.length === 0) {

        resultBox.innerHTML =
            "<div class='search-item'>No Product Found</div>";

        return;
    }

    results.forEach(product => {

        let div = document.createElement("div");

        div.className = "search-item";

        div.innerHTML = product;

        div.onclick = function () {

            openProduct(product);

        };

        resultBox.appendChild(div);

    });

}


function showToast(message){

    const toast = document.getElementById("toast");

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(()=>{
        toast.classList.remove("show");
    },2500);

}


// =====================================
// OPEN PRODUCT
// =====================================

function openProduct(productName) {

    let cards = document.querySelectorAll(".product");

    document.getElementById("searchResults").innerHTML = "";

    document.getElementById("searchBox").value = productName;

    cards.forEach(card => {

        let name = card.querySelector("h3").innerText;

        if (name === productName) {

            card.style.display = "block";

            card.scrollIntoView({

                behavior: "smooth",
                block: "center"

            });

            card.style.boxShadow = "0 0 30px gold";

            setTimeout(() => {

                card.style.boxShadow = "";

            }, 2000);

        }

        else {

            card.style.display = "none";

        }

    });

}

// =====================================
// SHOP NOW BUTTON
// =====================================

function scrollProducts() {

    document.getElementById("law").scrollIntoView({

        behavior: "smooth"

    });

}
// =====================================
// PAGE LOAD
// =====================================

window.onload = function () {

    // ==========================
    // CHECKOUT PAGE
    // ==========================

    let selected = document.getElementById("selectedProduct");

    if (selected) {
     

        let items = JSON.parse(localStorage.getItem("cart")) || [];

        if (items.length > 0) {

            selected.innerHTML = "";

            const SHIPPING_CHARGE = 260;

selected.innerHTML = "";

const qtyInput = document.getElementById("quantity");
qtyInput.value = items[0].qty || 1;


function updateSummary() {

    const qty = Number(qtyInput.value) || 1;

    const item = items[0];

    const subTotal = item.price * qty;

    const grandTotal = subTotal + SHIPPING_CHARGE;

    selected.innerHTML = `
        <p>
            <b>Product:</b> ${item.name}<br>
            <b>Price:</b> Rs. ${item.price}<br>
            <b>Quantity:</b> ${qty}
        </p>
        <hr>
    `;

    document.getElementById("subTotal").innerHTML =
        "Product Total : Rs. " + subTotal;

    document.getElementById("shipping").innerHTML =
        "Shipping : Rs. " + SHIPPING_CHARGE;

    document.getElementById("grandTotal").innerHTML =
        "Grand Total : Rs. " + grandTotal;
}

updateSummary();

qtyInput.addEventListener("input", updateSummary);
        }

        else {

            selected.innerHTML = "No Product Selected";

        }

    }

    // ==========================
    // SUCCESS PAGE
    // ==========================

    let order = JSON.parse(localStorage.getItem("orderDetails"));

    if (order) {

        if (document.getElementById("successProduct")) {

            document.getElementById("successProduct").innerHTML =
                "🛒 Product: " + order.product;

            document.getElementById("successQuantity").innerHTML =
                "📦 Quantity: " + order.quantity;

            document.getElementById("successPrice").innerHTML =
                "💰 Price: Rs. " + order.price;

            document.getElementById("successName").innerHTML =
                "👤 Name: " + order.name;

            document.getElementById("successPhone").innerHTML =
                "📞 Phone: " + order.phone;

            document.getElementById("successAddress").innerHTML =
                "📍 Address: " + order.address;

        }

    }
     if (
    document.getElementById("lawProducts") ||
    document.getElementById("cricketProducts") ||
    document.getElementById("hockeyProducts")
) {
    loadProducts();
}

loadWishlist();

}; 

// =====================================
// PLACE ORDER & SAVE TO MONGODB
// =====================================

async function placeOrder() {

    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let address = document.getElementById("address").value.trim();
    let quantity = parseInt(document.getElementById("quantity").value);

    let products = JSON.parse(localStorage.getItem("cart")) || [];

    if (products.length === 0) {

        alert("Please Select a Product");
        return;

    }

    if (name === "" || phone === "" || address === "") {

        alert("Please Fill All Details");
        return;

    }

    if (!quantity || quantity < 1) {

        alert("Please Enter Valid Quantity");
        return;

    }

    const product = products[0];

     const subTotal = product.price * quantity;

const shipping = 260;

const totalPrice = subTotal + shipping;

    const orderData = {

        customerName: name,
        phone: phone,
        address: address,

        productName: product.name,
        quantity: quantity,
        price: totalPrice

    };
          console.log(orderData);
    try {

        const response = await fetch("https://a-u-shop-production.up.railway.app/api/orders", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(orderData)

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Order Failed");
            return;

        }

        localStorage.setItem("orderDetails", JSON.stringify({

            product: product.name,
            quantity: quantity,
            price: totalPrice,
            name: name,
            phone: phone,
            address: address

        }));

        localStorage.removeItem("cart");

        alert("✅ Order Placed Successfully!");

        window.location.href = "success.html";

    }

    catch (error) {

        console.error(error);

        alert("❌ Server Connection Failed!");

    }

}
// =====================================
// GO HOME
// =====================================

function goHome() {

    localStorage.removeItem("orderDetails");
    localStorage.removeItem("cart");

    window.location.href = "index.html";

}

// =====================================
// RECOMMENDED PRODUCTS
// =====================================

window.addEventListener("DOMContentLoaded", () => {

    const recommendProducts = document.getElementById("recommendProducts");

    if (!recommendProducts) return;

    const products = [

        {
            name: "Criminal Law Book",
            price: 300
        },

        {
            name: "Cricket Bat",
            price: 2500
        },

        {
            name: "Hockey Stick",
            price: 2800
        }

    ];

    products.forEach(product => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `

            <img src="https://via.placeholder.com/250">

            <h3>${product.name}</h3>

            <p>Rs. ${product.price}</p>

            <button onclick="addCart('${product.name}', ${product.price})">
                Add To Cart
            </button>

        `;

        recommendProducts.appendChild(card);

    });

});
const PRODUCT_API = "https://a-u-shop-production.up.railway.app/api/products";

async function loadProducts() {

    try {

        const response = await fetch(PRODUCT_API);
        const data = await response.json();

        const lawContainer = document.getElementById("lawProducts");
        const cricketContainer = document.getElementById("cricketProducts");
        const hockeyContainer = document.getElementById("hockeyProducts");

        if (lawContainer) lawContainer.innerHTML = "";
        if (cricketContainer) cricketContainer.innerHTML = "";
        if (hockeyContainer) hockeyContainer.innerHTML = "";

        
    data.products.forEach(product => {

          const card = `
<div class="card product" onclick='openProductPage(${JSON.stringify(product)})'>

    <img src="${product.image || 'https://via.placeholder.com/250'}" alt="${product.name}">

    <h3>${product.name}</h3>

    <p>Rs. ${product.price}</p>

    <div class="card-buttons">

        <button onclick="event.stopPropagation(); addCart('${product.name}', ${product.price})">
            🛒 Add To Cart
        </button>


</div>


</div>
`;




            if (product.category === "Law" && lawContainer) {
    lawContainer.innerHTML += card;
}

else if (product.category === "Cricket" && cricketContainer) {
    cricketContainer.innerHTML += card;
}

else if (product.category === "Hockey" && hockeyContainer) {
    hockeyContainer.innerHTML += card;
}
        });

    }

    catch (error) {

        console.error("Error Loading Products:", error);

    }

}


function openProductPage(product) {

    localStorage.setItem(
        "selectedProduct",
        JSON.stringify(product)
    );

    window.location.href = "product.html";

}



// =====================================
// WISHLIST SYSTEM
// =====================================

function toggleWishlist(product) {

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const index = wishlist.findIndex(item => item.name === product.name);

    if (index === -1) {

        wishlist.push(product);
        showToast("❤️ Added To Wishlist");

    } else {

        wishlist.splice(index, 1);
        showToast("❌ Removed From Wishlist");

    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    if (document.getElementById("lawProducts")) {
        loadProducts();
    }

    if (document.getElementById("wishlistContainer")) {
        loadWishlist();
    }

}

// =====================================
// CHECK IF PRODUCT IS IN WISHLIST
// =====================================

function isInWishlist(name) {

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    return wishlist.some(item => item.name === name);

}

// =====================================
// LOAD WISHLIST PAGE
// =====================================

function loadWishlist() {

    const container = document.getElementById("wishlistContainer");

    if (!container) return;

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlist.length === 0) {

        container.innerHTML = `
            <h2 style="color:white;text-align:center;">
                ❤️ Your Wishlist Is Empty
            </h2>
        `;

        return;

    }

    container.innerHTML = "";

    wishlist.forEach(product => {

        container.innerHTML += `

        <div class="card product">

            <img src="${product.image || 'https://via.placeholder.com/250'}">

            <h3>${product.name}</h3>

            <p>Rs. ${product.price}</p>

            <div class="card-buttons">

                <button onclick="addCart('${product.name}', ${product.price})">
                    🛒 Add To Cart
                </button>

                <button onclick="removeWishlist('${product.name}')">
                    🗑 Remove
                </button>

            </div>

        </div>

        `;

    });

}

// =====================================
// REMOVE FROM WISHLIST
// =====================================

function removeWishlist(name) {

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    wishlist = wishlist.filter(item => item.name !== name);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    loadWishlist();

    if (document.getElementById("lawProducts")) {
        loadProducts();
    }

}