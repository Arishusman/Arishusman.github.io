// ======================================
// A.U SHOP ADMIN DASHBOARD
// dashboard.js
// ======================================

const ORDER_API = "https://a-u-shop-production.up.railway.app/api/orders";
const PRODUCT_API = "https://a-u-shop-production.up.railway.app/api/products";
const CATEGORY_API = "https://a-u-shop-production.up.railway.app/api/categories";

let orders = [];
let selectedOrder = null;

// ======================================
// Elements
// ======================================

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");

const dashboardMenu = document.getElementById("dashboardMenu");
const ordersMenu = document.getElementById("ordersMenu");
const productsMenu = document.getElementById("productsMenu");
const categoriesMenu = document.getElementById("categoriesMenu");
const settingsMenu = document.getElementById("settingsMenu");
const accountMenu = document.getElementById("accountMenu");
const logoutBtn = document.getElementById("logoutBtn");

const notificationBtn = document.getElementById("notificationBtn");
const settingBtn = document.getElementById("settingBtn");
const accountBtn = document.getElementById("accountBtn");
const moreOrdersBtn = document.getElementById("moreOrdersBtn");

const dashboardView = document.getElementById("dashboardView");
const dashboardSection = document.getElementById("dashboardSection");
const ordersSection = document.getElementById("ordersSection");
const productsSection = document.getElementById("productsSection");
const categoriesSection = document.getElementById("categoriesSection");

const totalSalesEl = document.getElementById("totalSales");
const todayOrdersEl = document.getElementById("todayOrders");
const processingOrdersEl = document.getElementById("processingOrders");
const shippingOrdersEl = document.getElementById("shippingOrders");
const deliveredOrdersEl = document.getElementById("deliveredOrders");

const recentOrdersBody = document.getElementById("recentOrdersBody");
const cancelledOrdersBody = document.getElementById("cancelledOrdersBody");
const allOrdersBody = document.getElementById("allOrdersBody");

const orderMenu = document.getElementById("orderMenu");
const changeStatusBtn = document.getElementById("changeStatusBtn");
const printInvoiceBtn = document.getElementById("printInvoiceBtn");
const cancelOrderBtn = document.getElementById("cancelOrderBtn");
const buyerDetailsBtn = document.getElementById("buyerDetailsBtn");
const deleteOrderBtn = document.getElementById("deleteOrderBtn");

const notificationModal = document.getElementById("notificationModal");
const settingsModal = document.getElementById("settingsModal");
const accountModal = document.getElementById("accountModal");
const buyerModal = document.getElementById("buyerModal");
const statusModal = document.getElementById("statusModal");
const cancelModal = document.getElementById("cancelModal");
const invoiceModal = document.getElementById("invoiceModal");

const notificationList = document.getElementById("notificationList");
const notificationCount = document.getElementById("notificationCount");
const buyerDetails = document.getElementById("buyerDetails");
const invoiceContent = document.getElementById("invoiceContent");
const orderStatus = document.getElementById("orderStatus");
const statusForm = document.getElementById("statusForm");
const printInvoice = document.getElementById("printInvoice");
const confirmCancel = document.getElementById("confirmCancel");

const addCategoryBtn = document.getElementById("addCategoryBtn");
const editCategoryBtn = document.getElementById("editCategoryBtn");
const assignCategoryBtn = document.getElementById("assignCategoryBtn");
const categoryFormSection = document.getElementById("categoryFormSection");
const editCategorySection = document.getElementById("editCategorySection");
const assignCategorySection = document.getElementById("assignCategorySection");
const categoryGrid = document.getElementById("categoryGrid");
const editCategoryList = document.getElementById("editCategoryList");
const assignContainer = document.getElementById("assignContainer");
const categoryForm = document.getElementById("categoryForm");

const addProductBtn = document.getElementById("addProductBtn");
const editProductBtn = document.getElementById("editProductBtn");
const addProductSection = document.getElementById("addProductSection");
const editProductSection = document.getElementById("editProductSection");
const editProductForm = document.getElementById("editProductForm");
const productForm = document.getElementById("productForm");
const updateProductForm = document.getElementById("updateProductForm");
const productGrid = document.getElementById("productGrid");
const searchProduct = document.getElementById("searchProduct");
const productCategory = document.getElementById("productCategory");
const editProductCategory = document.getElementById("editProductCategory");

const settingsForm = document.getElementById("settingsForm");
const themeSelect = document.getElementById("themeSelect");

// ======================================
// Helpers
// ======================================

function normalizeStatus(status) {
    if (status === "In Progress") return "Processing";
    return status;
}

function getOrderTotal(order) {
    return Number(order.price) * Number(order.quantity || 1);
}

function getStatusClass(status) {
    const value = normalizeStatus(status);
    if (value === "Shipping") return "shipping";
    if (value === "Delivered") return "delivered";
    if (value === "Cancelled") return "cancelled";
    return "processing";
}

function fileToBase64(input) {
    return new Promise((resolve) => {
        if (!input || !input.files || !input.files[0]) {
            resolve("");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(input.files[0]);
    });
}

function hideCategorySections() {
    if (categoryFormSection) categoryFormSection.style.display = "none";
    if (editCategorySection) editCategorySection.style.display = "none";
    if (assignCategorySection) assignCategorySection.style.display = "none";
}

function hideProductSections() {
    if (addProductSection) addProductSection.style.display = "none";
    if (editProductSection) editProductSection.style.display = "none";
    if (editProductForm) editProductForm.style.display = "none";
}

function hideMainSections() {
    if (dashboardView) dashboardView.style.display = "none";
    if (ordersSection) ordersSection.style.display = "none";
    if (productsSection) productsSection.style.display = "none";
    if (categoriesSection) categoriesSection.style.display = "none";
    hideCategorySections();
    hideProductSections();
}
function showSection
(section) {
    hideMainSections();
    if (section) section.style.display = "block";
}

// ===============================
// SIDEBAR MENU EVENTS
// ===============================

dashboardMenu.addEventListener("click", () => {

    showSection(dashboardView);

});


ordersMenu.addEventListener("click", () => {

    showSection(ordersSection);
    loadOrders();

});


productsMenu.addEventListener("click", () => {

    showSection(productsSection);
    loadProducts();

});


categoriesMenu.addEventListener("click", () => {

    showSection(categoriesSection);
    loadCategories();

});

function closeAllModals() {
    document.querySelectorAll(".modal").forEach((modal) => {
        modal.style.display = "none";
    });
}

function renderOrderRows(container, list, emptyMessage) {
    if (!container) return;

    container.innerHTML = "";

    if (!list.length) {
        container.innerHTML = `
            <tr>
                <td colspan="7" class="emptyMessage">${emptyMessage}</td>
            </tr>
        `;
        return;
    }

    list.forEach((order, index) => {
        container.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${order.customerName}</td>
                <td>${order.phone}</td>
                <td>Rs. ${getOrderTotal(order).toLocaleString()}</td>
                <td>
                    <span class="status ${getStatusClass(order.status)}">
                        ${normalizeStatus(order.status)}
                    </span>
                </td>
                <td>${new Date(order.createdAt).toLocaleString()}</td>
                <td>
                    <button type="button" class="actionBtn" onclick="showOrderMenu('${order._id}', event)">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

if (deleteOrderBtn) {
    deleteOrderBtn.addEventListener("click", async () => {

        if (!selectedOrder) {
            alert("No order selected");
            return;
        }

        orderMenu.style.display = "none";

        const confirmDelete = confirm(
            "Are you sure you want to permanently delete this order?"
        );

        if (!confirmDelete) return;

        try {

            const response = await fetch(`${ORDER_API}/${selectedOrder._id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Delete Failed");
                return;
            }

            alert("✅ Order Deleted Successfully");

            loadDashboard();

        } catch (error) {

            console.error(error);

            alert("❌ Server Connection Failed");

        }

    });
}

// ======================================
// Theme + Modals
// ======================================

const savedTheme = localStorage.getItem("theme") || "goldDark";
document.body.setAttribute("data-theme", savedTheme);

if (themeSelect) {
    themeSelect.value = savedTheme;
    themeSelect.addEventListener("change", () => {
        document.body.setAttribute("data-theme", themeSelect.value);
        localStorage.setItem("theme", themeSelect.value);
    });
}

if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
        notificationModal.style.display = "flex";
    });
}

if (settingBtn) {
    settingBtn.addEventListener("click", () => {
        settingsModal.style.display = "flex";
    });
}

if (settingsMenu) {
    settingsMenu.addEventListener("click", () => {
        settingsModal.style.display = "flex";
    });
}

if (accountBtn) {
    accountBtn.addEventListener("click", () => {
        accountModal.style.display = "flex";
    });
}

if (accountMenu) {
    accountMenu.addEventListener("click", () => {
        accountModal.style.display = "flex";
    });
}

document.querySelectorAll(".closeModal").forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
});

window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
        e.target.style.display = "none";
    }

    if (!e.target.closest(".actionBtn") && !e.target.closest("#orderMenu") && orderMenu) {
        orderMenu.style.display = "none";
    }
});

// ======================================
// Dashboard + Orders
// ======================================

async function loadDashboard() {
    try {
        const response = await fetch(ORDER_API);
        const data = await response.json();

        if (!data.success) {
            alert("Unable to load dashboard");
            return;
        }

        orders = data.orders || [];
        updateDashboardCards();
        loadRecentOrders();
        loadAllOrders();
        loadCancelledOrders();
        loadNotifications();
    } catch (error) {
        console.log(error);
        alert("Cannot connect to server");
    }
}

function updateDashboardCards() {
    let totalSale = 0;
    let today = 0;
    let processing = 0;
    let shipping = 0;
    let delivered = 0;
    const todayDate = new Date().toDateString();

    orders.forEach((order) => {
        totalSale += getOrderTotal(order);

        if (new Date(order.createdAt).toDateString() === todayDate) {
            today++;
        }

        const status = normalizeStatus(order.status);

        if (status === "Processing") processing++;
        if (status === "Shipping") shipping++;
        if (status === "Delivered") delivered++;
    });

    if (totalSalesEl) totalSalesEl.textContent = "Rs. " + totalSale.toLocaleString();
    if (todayOrdersEl) todayOrdersEl.textContent = today;
    if (processingOrdersEl) processingOrdersEl.textContent = processing;
    if (shippingOrdersEl) shippingOrdersEl.textContent = shipping;
    if (deliveredOrdersEl) deliveredOrdersEl.textContent = delivered;
}

function loadRecentOrders() {
    const activeOrders = orders.filter((order) => normalizeStatus(order.status) !== "Cancelled");
    renderOrderRows(recentOrdersBody, activeOrders.slice(0, 5), "No Orders Found");
}

function loadAllOrders() {
    const activeOrders = orders.filter((order) => normalizeStatus(order.status) !== "Cancelled");
    renderOrderRows(allOrdersBody, activeOrders, "No Orders Found");
}

function loadCancelledOrders() {
    if (!cancelledOrdersBody) return;

    cancelledOrdersBody.innerHTML = "";
    const cancelled = orders.filter((order) => normalizeStatus(order.status) === "Cancelled");

    if (!cancelled.length) {
        cancelledOrdersBody.innerHTML = `
            <tr>
                <td colspan="6" class="emptyMessage">No Cancelled Orders Found</td>
            </tr>
        `;
        return;
    }

    cancelled.forEach((order, index) => {
        cancelledOrdersBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${order.customerName}</td>
                <td>${order.phone}</td>
                <td>Rs. ${getOrderTotal(order).toLocaleString()}</td>
                <td>${new Date(order.updatedAt || order.createdAt).toLocaleString()}</td>
                <td>Cancelled</td>
            </tr>
        `;
    });
}

function loadNotifications() {
    if (!notificationList) return;

    notificationList.innerHTML = "";
    if (notificationCount) notificationCount.textContent = orders.length;

    if (!orders.length) {
        notificationList.innerHTML = `<p class="emptyMessage">No Notifications</p>`;
        return;
    }

    orders.slice(0, 5).forEach((order) => {
        notificationList.innerHTML += `
            <div class="notificationItem">
                <h4>New Order</h4>
                <p>${order.customerName}</p>
                <small>${new Date(order.createdAt).toLocaleString()}</small>
            </div>
        `;
    });
}

function showOrderMenu(id, event) {
    event.stopPropagation();
    selectedOrder = orders.find((order) => order._id === id);
    if (!selectedOrder || !orderMenu) return;

    orderMenu.style.display = "block";
    orderMenu.style.left = event.pageX + "px";
    orderMenu.style.top = event.pageY + "px";
}

function openBuyerDetails() {
    if (!selectedOrder) return;

    buyerModal.style.display = "flex";
    buyerDetails.innerHTML = `
        <h3>${selectedOrder.customerName}</h3>
        <hr>
        <p><strong>Phone :</strong> ${selectedOrder.phone}</p>
        <p><strong>Address :</strong> ${selectedOrder.address}</p>
        <p><strong>Product :</strong> ${selectedOrder.productName}</p>
        <p><strong>Quantity :</strong> ${selectedOrder.quantity}</p>
        <p><strong>Price :</strong> Rs. ${selectedOrder.price}</p>
        <p><strong>Status :</strong> ${normalizeStatus(selectedOrder.status)}</p>
        <p><strong>Order Date :</strong> ${new Date(selectedOrder.createdAt).toLocaleString()}</p>
    `;
}

function createInvoice() {
    if (!selectedOrder) return;

    invoiceModal.style.display = "flex";
    invoiceContent.innerHTML = `
        <h2>A.U SHOP</h2>
        <hr>
        <p><strong>Customer :</strong> ${selectedOrder.customerName}</p>
        <p><strong>Phone :</strong> ${selectedOrder.phone}</p>
        <p><strong>Address :</strong> ${selectedOrder.address}</p>
        <p><strong>Product :</strong> ${selectedOrder.productName}</p>
        <p><strong>Quantity :</strong> ${selectedOrder.quantity}</p>
        <p><strong>Price :</strong> Rs. ${selectedOrder.price}</p>
        <p><strong>Total :</strong> Rs. ${getOrderTotal(selectedOrder).toLocaleString()}</p>
        <p><strong>Status :</strong> ${normalizeStatus(selectedOrder.status)}</p>
        <p><strong>Date :</strong> ${new Date(selectedOrder.createdAt).toLocaleString()}</p>
    `;
}

if (buyerDetailsBtn) {
    buyerDetailsBtn.addEventListener("click", () => {
        orderMenu.style.display = "none";
        openBuyerDetails();
    });
}

if (printInvoiceBtn) {
    printInvoiceBtn.addEventListener("click", () => {
        orderMenu.style.display = "none";
        createInvoice();
    });
}

if (printInvoice) {
    printInvoice.addEventListener("click", () => {
        window.print();
    });
}

if (changeStatusBtn) {
    changeStatusBtn.addEventListener("click", () => {
        if (!selectedOrder) return;
        orderStatus.value = normalizeStatus(selectedOrder.status);
        statusModal.style.display = "flex";
    });
}

if (statusForm) {
    statusForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${ORDER_API}/${selectedOrder._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: orderStatus.value })
            });

            const data = await response.json();
            if (!data.success) {
                alert("Status Update Failed");
                return;
            }

            statusModal.style.display = "none";
            loadDashboard();
        } catch (error) {
            console.log(error);
            alert("Server Error");
        }
    });
}

if (cancelOrderBtn) {
    cancelOrderBtn.addEventListener("click", () => {
        if (!selectedOrder) return;
        orderMenu.style.display = "none";
        cancelModal.style.display = "flex";


        if (deleteOrderBtn) {
    deleteOrderBtn.addEventListener("click", async () => {

        if (!selectedOrder) return;

        orderMenu.style.display = "none";

        const confirmDelete = confirm(
            "Are you sure you want to permanently delete this order?"
        );

        if (!confirmDelete) return;

        try {

            const response = await fetch(
                `${ORDER_API}/${selectedOrder._id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Delete Failed");
                return;
            }

            alert("✅ Order Deleted Successfully");

            loadDashboard();

        } catch (error) {

            console.error(error);

            alert("❌ Server Connection Failed");

        }

    });
}
    });
}

if (confirmCancel) {
    confirmCancel.addEventListener("click", async () => {
        try {
            const response = await fetch(`${ORDER_API}/${selectedOrder._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Cancelled" })
            });

            const data = await response.json();
            if (!data.success) {
                alert("Unable to cancel order");
                return;
            }

            cancelModal.style.display = "none";
            loadDashboard();
        } catch (error) {
            console.log(error);
            alert("Server Error");
        }
    });
}

// ======================================
// Categories
// ======================================

if (addCategoryBtn) {
    addCategoryBtn.addEventListener("click", () => {
        hideCategorySections();
        categoryFormSection.style.display = "block";
    });
}

if (editCategoryBtn) {
    editCategoryBtn.addEventListener("click", () => {
        hideCategorySections();
        editCategorySection.style.display = "block";
        loadCategories();
    });
}

if (assignCategoryBtn) {
    assignCategoryBtn.addEventListener("click", () => {
        hideCategorySections();
        assignCategorySection.style.display = "block";
        loadProductsForCategory();
    });
}

if (categoryForm) {
    categoryForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const banner = await fileToBase64(document.getElementById("categoryBanner"));

        const body = {
            name: document.getElementById("categoryName").value.trim(),
            description: document.getElementById("categoryDescription").value.trim(),
            banner
        };

        try {
            const response = await fetch(CATEGORY_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            alert(data.message || "Category saved");
            categoryForm.reset();
            loadCategories();
            loadCategoryOptions();
        } catch (error) {
            console.log(error);
            alert("Server Error");
        }
    });
}

async function loadCategories() {
    try {
        const response = await fetch(CATEGORY_API);
        const data = await response.json();

        if (!data.success) {
            alert("Unable to load categories");
            return;
        }

        if (categoryGrid) categoryGrid.innerHTML = "";
        if (editCategoryList) editCategoryList.innerHTML = "";

        data.categories.forEach((category) => {
            const productCount = category.products ? category.products.length : 0;
            const banner = category.banner || "assets/no-image.png";

            if (categoryGrid) {
                categoryGrid.innerHTML += `
                    <div class="categoryCard">
                        <img src="${banner}" alt="${category.name}">
                        <h3>${category.name}</h3>
                        <p>${category.description || ""}</p>
                        <small>Products : ${productCount}</small>
                    </div>
                `;
            }

            if (editCategoryList) {
                editCategoryList.innerHTML += `
                    <div class="categoryCard">
                        <img src="${banner}" alt="${category.name}">
                        <h3>${category.name}</h3>
                        <p>${category.description || ""}</p>
                        <div class="cardButtons">
                            <button type="button" class="editBtn" onclick="editCategory('${category._id}')">Edit</button>
                            <button type="button" class="deleteBtn" onclick="deleteCategory('${category._id}')">Delete</button>
                        </div>
                    </div>
                `;
            }
        });
    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

async function editCategory(id) {
    const newName = prompt("Enter New Category Name");
    if (!newName) return;

    try {
        const response = await fetch(`${CATEGORY_API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName.trim() })
        });

        const data = await response.json();
        alert(data.message || "Category Updated");
        loadCategories();
        loadCategoryOptions();
    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

async function deleteCategory(id) {
    if (!confirm("Delete this category?")) return;

    try {
        const response = await fetch(`${CATEGORY_API}/${id}`, { method: "DELETE" });
        const data = await response.json();
        alert(data.message || "Category Deleted");
        loadCategories();
        loadCategoryOptions();
    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

async function loadProductsForCategory() {
    try {
        const [productRes, categoryRes] = await Promise.all([
            fetch(PRODUCT_API),
            fetch(CATEGORY_API)
        ]);

        const productData = await productRes.json();
        const categoryData = await categoryRes.json();

        if (!productData.success || !categoryData.success) {
            assignContainer.innerHTML = "<p>Unable to load data.</p>";
            return;
        }

        assignContainer.innerHTML = "";

        categoryData.categories.forEach((category) => {
            let options = `<option value="">Select Product</option>`;

            productData.products.forEach((product) => {
                options += `<option value="${product._id}">${product.name}</option>`;
            });

            assignContainer.innerHTML += `
                <div class="assignCard">
                    <h3>${category.name}</h3>
                    <p>${category.description || ""}</p>
                    <select id="productSelect_${category._id}">${options}</select>
                    <button type="button" class="greenBtn" onclick="assignProduct('${category._id}')">Assign Product</button>
                </div>
            `;
        });
    } catch (error) {
        console.log(error);
        assignContainer.innerHTML = "<p>Server Error</p>";
    }
}

async function assignProduct(categoryId) {
    const select = document.getElementById("productSelect_" + categoryId);
    const productId = select ? select.value : "";

    if (!productId) {
        alert("Please select a product");
        return;
    }

    try {
        const response = await fetch(`${CATEGORY_API}/${categoryId}/product/${productId}`, {
            method: "POST"
        });

        const data = await response.json();
        alert(data.message || "Product assigned");
        loadProductsForCategory();
        loadCategories();
    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

async function loadCategoryOptions() {
    try {
        const response = await fetch(CATEGORY_API);
        const data = await response.json();
        if (!data.success) return;

        const options = data.categories
            .map((category) => `<option value="${category.name}">${category.name}</option>`)
            .join("");

        if (productCategory) {
            productCategory.innerHTML = `<option value="">Select Category</option>${options}`;
        }

        if (editProductCategory) {
            editProductCategory.innerHTML = options;
        }
    } catch (error) {
        console.log(error);
    }
}

// ======================================
// Products
// ======================================

if (addProductBtn) {
    addProductBtn.addEventListener("click", () => {
        hideProductSections();
        addProductSection.style.display = "block";
        loadCategoryOptions();
    });
}

if (editProductBtn) {
    editProductBtn.addEventListener("click", () => {
        hideProductSections();
        editProductSection.style.display = "block";
        loadProducts();
    });
}

if (productForm) {
    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", document.getElementById("productName").value.trim());
        formData.append("category", document.getElementById("productCategory").value);
        formData.append("description", document.getElementById("productDescription").value.trim());
        formData.append("price", document.getElementById("productPrice").value);
        formData.append("discount", document.getElementById("productDiscount").value || 0);
        formData.append("stock", document.getElementById("productStock").value || 0);
        formData.append("status", document.getElementById("productStatus").value);

        const imageFile = document.getElementById("productImage").files[0];

        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {

            const response = await fetch(PRODUCT_API, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            alert(data.message || "Product Saved");

            productForm.reset();

            loadProducts();

        } catch (error) {

            console.log(error);

            alert("Server Error");

        }

    });
}
           

async function loadProducts() {
    try {
        const response = await fetch(PRODUCT_API);
        const data = await response.json();

        if (!data.success) {
            alert("Unable to load products");
            return;
        }

        productGrid.innerHTML = "";

        if (!data.products.length) {
            productGrid.innerHTML = `<p class="emptyMessage">No Products Found</p>`;
            return;
        }

        data.products.forEach((product) => {
            productGrid.innerHTML += `
                <div class="productCard">
                    <img src="${product.image || "assets/no-image.png"}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.category || ""}</p>
                    <h4 class="price">Rs. ${Number(product.price).toLocaleString()}</h4>
                    <small>Stock : ${product.stock || 0}</small>
                    <br><br>
                    <button type="button" class="editBtn" onclick="editProduct('${product._id}')">Edit</button>
                    <button type="button" class="deleteBtn" onclick="deleteProduct('${product._id}')">Delete</button>
                </div>
            `;
        });
    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

async function editProduct(id) {
    try {
        const response = await fetch(PRODUCT_API);
        const data = await response.json();
        if (!data.success) return;

        const product = data.products.find((item) => item._id === id);
        if (!product) {
            alert("Product Not Found");
            return;
        }

        await loadCategoryOptions();
        hideProductSections();
        editProductForm.style.display = "block";

        document.getElementById("editProductId").value = product._id;
        document.getElementById("editProductName").value = product.name;
        document.getElementById("editProductCategory").value = product.category;
        document.getElementById("editProductDescription").value = product.description || "";
        document.getElementById("editProductPrice").value = product.price;
        document.getElementById("editProductDiscount").value = product.discount || 0;
        document.getElementById("editProductStock").value = product.stock || 0;
        document.getElementById("editProductStatus").value = product.status || "Available";
    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

if (updateProductForm) {
    updateProductForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("editProductId").value;
        const imageFile = document.getElementById("editProductImage");
        let image = "";

        if (imageFile && imageFile.files && imageFile.files[0]) {
            image = await fileToBase64(imageFile);
        }

        const body = {
            name: document.getElementById("editProductName").value.trim(),
            category: document.getElementById("editProductCategory").value,
            description: document.getElementById("editProductDescription").value.trim(),
            price: Number(document.getElementById("editProductPrice").value),
            discount: Number(document.getElementById("editProductDiscount").value || 0),
            stock: Number(document.getElementById("editProductStock").value || 0),
            status: document.getElementById("editProductStatus").value
        };

        if (image) body.image = image;

        try {
            const response = await fetch(`${PRODUCT_API}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            if (!data.success) {
                alert("Product Update Failed");
                return;
            }

            alert("Product Updated Successfully");
            editProductForm.style.display = "none";
            loadProducts();
        } catch (error) {
            console.log(error);
            alert("Server Error");
        }
    });
}

async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    try {
        const response = await fetch(`${PRODUCT_API}/${id}`, { method: "DELETE" });
        const data = await response.json();

        if (!data.success) {
            alert("Delete Failed");
            return;
        }

        alert(data.message || "Product Deleted");
        loadProducts();
    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

if (searchProduct) {
    searchProduct.addEventListener("keyup", () => {
        const value = searchProduct.value.toLowerCase();

        document.querySelectorAll(".productCard").forEach((card) => {
            card.style.display = card.innerText.toLowerCase().includes(value) ? "block" : "none";
        });
    });
}

// ======================================
// Settings + Logout
// ======================================

if (settingsForm) {
    settingsForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const settings = {
            storeName: document.getElementById("storeName").value,
            theme: document.getElementById("themeSelect").value
        };

        localStorage.setItem("storeSettings", JSON.stringify(settings));
        alert("Settings Saved Successfully");
        settingsModal.style.display = "none";
    });
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem("storeSettings"));
    if (!settings) return;

    if (document.getElementById("storeName")) {
        document.getElementById("storeName").value = settings.storeName || "";
    }

    if (document.getElementById("themeSelect") && settings.theme) {
        document.getElementById("themeSelect").value = settings.theme;
        document.body.setAttribute("data-theme", settings.theme);
    }
}

logoutBtn.addEventListener("click", () => {

    if (!confirm("Logout?")) return;

    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminName");

    window.location.href = "admin-login.html";

});

// ======================================
// Initialize
// ======================================

window.addEventListener("DOMContentLoaded", () => {
    hideMainSections();
    if (dashboardView) dashboardView.style.display = "block";

    loadSettings();
    loadDashboard();
    loadCategories();
    loadCategoryOptions();
    loadProducts();
});

setInterval(loadDashboard, 30000);

// Global functions for inline onclick handlers
window.showOrderMenu = showOrderMenu;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.assignProduct = assignProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

const quickProductsBtn = document.getElementById("quickProductsBtn");
const quickCategoriesBtn = document.getElementById("quickCategoriesBtn");

if (quickProductsBtn) {
    quickProductsBtn.addEventListener("click", () => {
        productsMenu.click();
    });
}

if (quickCategoriesBtn) {
    quickCategoriesBtn.addEventListener("click", () => {
        categoriesMenu.click();
    });
}