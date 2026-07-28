async function trackOrder() {

    const phone = document.getElementById("phone").value;

    const response = await fetch("https://a-u-shop-production.up.railway.app/api/orders");

    const data = await response.json();

    const orders = data.orders.filter(o => o.phone === phone);

    if (orders.length === 0) {

    document.getElementById("result").innerHTML =
        "<h2>❌ No Order Found</h2>";

    return;
}

let html = "";

orders.forEach(order => {

    html += `

    <div class="track-card">

        <h3>${order.productName}</h3>

        <p>📦 Quantity: ${order.quantity}</p>

        <p>💰 Price: Rs. ${order.price}</p>

        <p>🚚 Status: <b>${order.status}</b></p>

        <p>📍 Address: ${order.address}</p>

    </div>

    `;

});

document.getElementById("result").innerHTML = html;

}