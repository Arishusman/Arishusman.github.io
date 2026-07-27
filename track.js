async function trackOrder() {

    const phone = document.getElementById("phone").value;

    const response = await fetch("https://a-u-shop-production.up.railway.app/api/orders");

    const data = await response.json();

    const order = data.orders.find(o => o.phone === phone);

    if (!order) {

        document.getElementById("result").innerHTML =
            "❌ Order Not Found";

        return;
    }

    document.getElementById("result").innerHTML = `
        <h3>${order.productName}</h3>
        <p>Status: <b>${order.status}</b></p>
        <p>Price: Rs. ${order.price}</p>
    `;
}