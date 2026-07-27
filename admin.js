const API_URL = "http://localhost:5000/api/orders";

let allOrders = [];

// ==========================
// Load Orders
// ==========================
async function loadOrders() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        allOrders = data.orders;
        displayOrders(allOrders);

    } catch (error) {
        console.error("Error:", error);
    }
}

// ==========================
// Display Orders
// ==========================
function displayOrders(orders) {

    const table = document.getElementById("ordersTable");
    table.innerHTML = "";

    orders.forEach(order => {

        table.innerHTML += `
            <tr>
                <td>${order.customerName}</td>
                <td>${order.phone}</td>
                <td>${order.productName}</td>
                <td>${order.quantity}</td>
                <td>Rs. ${order.price}</td>

                <td>
                    <select id="status-${order._id}">
                        <option value="In Progress" ${order.status === "In Progress" ? "selected" : ""}>In Progress</option>
                        <option value="Shipped" ${order.status === "Shipped" ? "selected" : ""}>Shipped</option>
                        <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
                    </select>
                </td>

                <td>
                    <button onclick="updateStatus('${order._id}')">Update</button>
                    <button onclick="deleteOrder('${order._id}')">Delete</button>
                </td>
            </tr>
        `;
    });

}

// ==========================
// Search Orders
// ==========================
function searchOrders() {

    const keyword = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const status = document.getElementById("statusFilter").value;

    let filtered = allOrders.filter(order => {

        const matchSearch =
            order.customerName.toLowerCase().includes(keyword) ||
            order.phone.toLowerCase().includes(keyword) ||
            order.productName.toLowerCase().includes(keyword);

        const matchStatus =
            status === "All" || order.status === status;

        return matchSearch && matchStatus;
    });

    displayOrders(filtered);
}

// ==========================
// Status Filter
// ==========================
function filterOrders() {
    searchOrders();
}

// ==========================
// Update Status
// ==========================
async function updateStatus(id) {

    const status = document.getElementById(`status-${id}`).value;

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
    });

    alert("Status Updated");

    loadOrders();
}

// ==========================
// Delete Order
// ==========================
async function deleteOrder(id) {

    if (!confirm("Delete this order?")) return;

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    alert("Order Deleted");

    loadOrders();
}

// ==========================
// Start
// ==========================
loadOrders();