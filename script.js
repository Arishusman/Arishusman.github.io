// =====================================
// A.U SHOP SCRIPT
// PART 1
// =====================================

// Cart Data
let cart = JSON.parse(localStorage.getItem("cart")) || [];



// =====================================
// ADD TO CART
// =====================================

function addCart(productName, productPrice, productQty = 1) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.name === productName);

    if (existing) {

        existing.qty += productQty;

    } else {

        cart.push({

            name: productName,

            price: productPrice,

            qty: productQty

        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    showToast("🛒 Product Added To Cart");

}

// =====================================
// SEARCH SYSTEM
// =====================================

function searchProduct(){

const input=document.getElementById("searchBox").value
.toLowerCase()
.trim();

const resultBox=document.getElementById("searchResults");

resultBox.innerHTML="";

if(input==="") return;

document.querySelectorAll(".product").forEach(card=>{

const name=card.querySelector("h3").innerText;

if(name.toLowerCase().includes(input)){

const div=document.createElement("div");

div.className="search-item";

div.innerHTML=name;

div.onclick=function(){

card.scrollIntoView({

behavior:"smooth",

block:"center"

});

card.style.boxShadow="0 0 30px gold";

setTimeout(()=>{

card.style.boxShadow="";

},2000);

resultBox.innerHTML="";

document.getElementById("searchBox").value=name;

};

resultBox.appendChild(div);

}

});

if(resultBox.innerHTML===""){

resultBox.innerHTML="<div class='search-item'>No Product Found</div>";

}

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

            

selected.innerHTML = "";



const SHIPPING_CHARGE = 260;

let subTotal = 0;

selected.innerHTML = "";

items.forEach((item, index) => {

    subTotal += item.price * item.qty;

    selected.innerHTML += `

    <div class="checkout-item">

        <h3>${item.name}</h3>

        <p>Price : Rs. ${item.price}</p>

        <div class="qty-box">

            <button onclick="changeQty(${index},-1)">−</button>

            <span id="qty${index}">${item.qty}</span>

            <button onclick="changeQty(${index},1)">+</button>

        </div>

        <p>

        Total : Rs. ${item.price * item.qty}

        </p>

        <hr>

    </div>

    `;

});

document.getElementById("subTotal").innerHTML =
"Product Total : Rs. " + subTotal;

document.getElementById("shipping").innerHTML =
"Shipping : Rs. " + SHIPPING_CHARGE;

document.getElementById("grandTotal").innerHTML =
"Grand Total : Rs. " + (subTotal + SHIPPING_CHARGE);

   } else {

    selected.innerHTML = "No Product Selected";

}

} 

    // ==========================
    // SUCCESS PAGE
    // ==========================

    let order = JSON.parse(localStorage.getItem("orderDetails"));

    if (order) {

        if (document.getElementById("successProduct")) {

            let productHTML = "";

let totalQty = 0;

order.products.forEach(item => {

    totalQty += item.qty;

    productHTML += `
        ${item.name} × ${item.qty}<br>
    `;

});

document.getElementById("successProduct").innerHTML =
"🛒 Products:<br>" + productHTML;

document.getElementById("successQuantity").innerHTML =
"📦 Total Items: " + totalQty;


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

    let products = JSON.parse(localStorage.getItem("cart")) || [];

    if (products.length === 0) {

        alert("Please Select a Product");
        return;

    }

    if (name === "" || phone === "" || address === "") {

        alert("Please Fill All Details");
        return;

    }


    
const shipping = 260;

let totalPrice = shipping;

products.forEach(item => {

    totalPrice += item.price * item.qty;

});

    const orderData = {

    customerName: name,
    phone: phone,
    address: address,

    productName: products
        .map(item => item.name)
        .join(", "),

    quantity: products.reduce(
        (sum, item) => sum + item.qty,
        0
    ),

    price: totalPrice

};
          console.log(orderData);
    try {

        const response = await fetch("https://a-u-shop-production-bae8.up.railway.app/api/orders", {

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

    products: products,

    total: totalPrice,

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
const PRODUCT_API = "https://a-u-shop-production-bae8.up.railway.app/api/products";

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

// Premium Loader


window.addEventListener("load",()=>{

const brand=document.getElementById("brandText");

const tag=document.getElementById("tagline");

const text="A.U SHOP";

let i=0;

let typing=setInterval(()=>{

brand.innerHTML+=text.charAt(i);

i++;

if(i>=text.length){

clearInterval(typing);

setTimeout(()=>{

tag.style.opacity=1;

tag.innerHTML="PREMIUM ONLINE SHOPPING";

},400);

}

},220);

setTimeout(()=>{

document.getElementById("intro").classList.add("intro-hide");

},3000);

});

const themeBtn = document.getElementById("themeToggle");

if(localStorage.getItem("theme") === "light"){

    document.body.classList.add("light");

    themeBtn.innerHTML="☀️";

}

themeBtn.onclick=function(){

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        localStorage.setItem("theme","light");

        themeBtn.innerHTML="☀️";

    }else{

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML="🌙";

    }

}

function changeQty(index, value){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].qty += value;

    if(cart[index].qty <= 0){

        cart.splice(index,1);

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    location.reload();

}

function removeCart(index){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index,1);

    localStorage.setItem("cart", JSON.stringify(cart));

    location.reload();

}

const searchSection=document.querySelector(".search-section");

if(searchSection){

window.addEventListener("scroll",()=>{

const top=searchSection.offsetTop;

if(window.scrollY>top){

searchSection.classList.add("sticky");

}else{

searchSection.classList.remove("sticky");

}

});

}