 // Navigation functions
        function toggleLeftNav() {
            const leftNav = document.getElementById('leftNavbar');
            const mainContent = document.getElementById('mainContent');
           
            leftNav.classList.toggle('open');
            mainContent.classList.toggle('shifted');
        }
 
        function toggleDropdown() {
            const dropdown = document.getElementById('profileDropdown');
            dropdown.classList.toggle('show');
        }
 
        function toggleSubMenu(menuId) {
            const menu = document.getElementById(menuId + 'Menu');
            const arrow = document.getElementById(menuId + 'Arrow');
           
            menu.classList.toggle('show');
            arrow.classList.toggle('rotated');
        }
 
        function logout() {
            alert('Logging out...');
            // Implement logout logic here
        }
 
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const dropdown = document.getElementById('profileDropdown');
            const profileIcon = document.querySelector('.profile-icon');
           
            if (!profileIcon.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
 
 
 
        // Close left navigation when clicking outside on mobile
        document.addEventListener('click', function(event) {
            const leftNav = document.getElementById('leftNavbar');
            const menuIcon = document.querySelector('.menu-icon');
            const mainContent = document.getElementById('mainContent');
           
            if (window.innerWidth <= 768 && leftNav.classList.contains('open') &&
                !leftNav.contains(event.target) && !menuIcon.contains(event.target)) {
                leftNav.classList.remove('open');
                mainContent.classList.remove('shifted');
            }
        });
 
        // Handle window resize
        window.addEventListener('resize', function() {
            const leftNav = document.getElementById('leftNavbar');
            const mainContent = document.getElementById('mainContent');
           
            if (window.innerWidth > 768) {
                // Reset mobile-specific classes on desktop
                if (leftNav.classList.contains('open')) {
                    mainContent.classList.add('shifted');
                }
            } else {
                // On mobile, remove shifted class
                mainContent.classList.remove('shifted');
            }
        });
 
     function logout() {
    // Custom styled confirm dialog
    const logoutModal = document.createElement('div');
    logoutModal.innerHTML = `
        <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000;">
            <div style="background:white; width:300px; padding:20px; border-radius:8px; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);">
                <h3 style="margin-top:0;">Confirm Logout</h3>
                <p>Are you sure you want to logout?</p>
                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                    <button id="cancelLogout" style="padding:8px 16px; background:#eee; border:none; border-radius:4px; cursor:pointer;">Cancel</button>
                    <button id="confirmLogout" style="padding:8px 16px; background:#d9534f; color:white; border:none; border-radius:4px; cursor:pointer;">Logout</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(logoutModal);
    
    // Handle button clicks
    document.getElementById('cancelLogout').addEventListener('click', () => {
        document.body.removeChild(logoutModal);
    });
    
    document.getElementById('confirmLogout').addEventListener('click', () => {
        // Create loader overlay
        const loaderOverlay = document.createElement('div');
        loaderOverlay.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 1001;
                display: flex;
                justify-content: center;
                align-items: center;
            ">
                <div style="
                    width: 80px;
                    height: 80px;
                    border: 8px solid #f3f3f3;
                    border-top: 8px solid #d9534f;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        // Remove confirmation modal and show loader
        document.body.removeChild(logoutModal);
        document.body.appendChild(loaderOverlay);
        
        // Perform logout operations (clear tokens, etc.)
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = '../Login/Login.html';
        }, 1500);
    });
}

//---------------------------main js---------------------------------------//
let orders = [];
let products = [];

async function fetchData() {
    try {
        const [ordersResponse, productsResponse] = await Promise.all([
            fetch('http://localhost:8080/api/orders/get-all-orders'),
            fetch('http://localhost:8080/api/products/get-all-product')
        ]);
        
        orders = await ordersResponse.json();
        products = await productsResponse.json();
        
        // Sort by recent date
        orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        
        displayOrders(orders);
    } catch (error) {
        console.error('Error fetching data:', error);
        displayOrders([]); // Display empty table with "No Order Found" on error
    }
}

function displayOrders(ordersToDisplay) {
    // Get the table body element
    const tbody = document.getElementById('ordersBody');
    if (!tbody) {
        console.error('Table body element not found');
        return;
    }
    tbody.innerHTML = '';

    // Check if there are no orders to display
    if (ordersToDisplay.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="16" style="text-align: center; padding: 20px;">No Order Found</td>';
        tbody.appendChild(row);
        return;
    }

    // Get today's date dynamically in local timezone (IST) in YYYY-MM-DD format
    const today = new Date();
    const todayDate = today.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD in local timezone (IST)

    // Iterate through orders and create table rows
    ordersToDisplay.forEach(order => {
        const row = document.createElement('tr');
        // Extract order date in YYYY-MM-DD format, handling ISO format with or without time
        const orderDate = order.orderDate.split('T')[0];
        // Check if order date matches today in local timezone
        const isToday = orderDate === todayDate;
        // Add "Today" label with green background if order is from today
        const customerCell = isToday 
            ? `${order.customerFirstName} ${order.customerLastName || ''} <span class="oy-today-label">Today</span>`
            : `${order.customerFirstName} ${order.customerLastName || ''}`;
        
        row.innerHTML = `
            <td><input type="checkbox" class="order-checkbox" data-id="${order.orderId}"></td>
            <td>${order.orderId}</td>
            <td class="oy-customer-cell">${customerCell}</td>
            <td>${order.customerPhone}</td>
            <td>${order.items.map(item => item.name).join(', ')}</td>
            <td>₹${order.total.toFixed(2)}</td>
            <td>${order.status}</td>
            <td>${order.orderDate}</td>
            <td>${order.shiprocketOrderId}</td>
            <td>${order.paymentMethod}</td>
            <td>${order.pickupLocation}</td>
            <td>${order.shippingAddress}</td>
            <td>${order.state}</td>
            <td>${order.pincode}</td>
            <td>${order.userId}</td>
            <td><button class="oy-btn oy-btn-primary oy-btn-sm" onclick="showOrderDetails(${order.orderId})">View</button></td>
        `;
        tbody.appendChild(row);
    });
}

function showOrderDetails(orderId) {
    const order = orders.find(o => o.orderId === orderId);
    const modal = document.getElementById('orderModal');
    const modalBody = document.getElementById('orderDetails');
    if (!modal || !modalBody) {
        console.error('Modal or modal body element not found');
        return;
    }

    modalBody.innerHTML = `
        <h6>Order #${order.orderId}</h6>
        <p><strong>Customer:</strong> ${order.customerFirstName} ${order.customerLastName || ''}</p>
        <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Order Date:</strong> ${order.orderDate}</p>
        <p><strong>Shipping:</strong> ${order.shippingAddress}, ${order.state} ${order.pincode}</p>
        <h6>Items:</h6>
        ${order.items.map(item => {
            const product = products.find(p => p.productId === item.productId);
            const imageSrc = product?.ProductImage ? `data:image/jpeg;base64,${product.ProductImage}` : '';
            return `
                <div class="oy-order-detail-item">
                    <img src="${imageSrc}" class="oy-order-item-img" alt="${item.name}">
                    <p><strong>${item.name}</strong></p>
                    <p>Qty: ${item.productQuantity} | Price: ₹${item.productPrice.toFixed(2)}</p>
                </div>
            `;
        }).join('')}
    `;
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('orderModal');
    if (modal) modal.classList.remove('show');
}

function applyFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const fromDateInput = document.getElementById('fromDate');
    const toDateInput = document.getElementById('toDate');
    const timeFilter = document.getElementById('timeFilter');

    let filteredOrders = [...orders];

    // Apply status filter
    if (statusFilter && statusFilter.value) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter.value);
    }

    // Apply time filter (Today, Week, This Month)
    if (timeFilter && timeFilter.value) {
        const today = new Date();
        const todayDate = today.toLocaleDateString('en-CA'); // Current date in YYYY-MM-DD in local timezone (IST)

        if (timeFilter.value === 'today') {
            filteredOrders = filteredOrders.filter(order => 
                order.orderDate.split('T')[0] === todayDate
            );
        } else if (timeFilter.value === 'week') {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday of current week
            const weekEnd = new Date(today);
            weekEnd.setDate(today.getDate() - today.getDay() + 7); // Sunday of current week
            weekEnd.setHours(23, 59, 59, 999); // Include entire Sunday
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.orderDate);
                orderDate.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
                return !isNaN(orderDate) && orderDate >= weekStart && orderDate <= weekEnd;
            });
        } else if (timeFilter.value === 'month') {
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1); // First day of current month
            const monthEnd = new Date(today);
            monthEnd.setHours(23, 59, 59, 999); // Include entire current day
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.orderDate);
                orderDate.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
                return !isNaN(orderDate) && orderDate >= monthStart && orderDate <= monthEnd;
            });
        }
    }

    // Apply custom date range filter (only if timeFilter is not set to avoid conflicts)
    if (!timeFilter?.value) {
        if (fromDateInput && fromDateInput.value) {
            const fromDate = new Date(fromDateInput.value);
            if (!isNaN(fromDate)) {
                filteredOrders = filteredOrders.filter(order => {
                    const orderDate = new Date(order.orderDate);
                    orderDate.setHours(0, 0, 0, 0); // Normalize to start of day
                    return !isNaN(orderDate) && orderDate >= fromDate;
                });
            }
        }

        if (toDateInput && toDateInput.value) {
            const toDate = new Date(toDateInput.value);
            toDate.setHours(23, 59, 59, 999); // Include entire day
            if (!isNaN(toDate)) {
                filteredOrders = filteredOrders.filter(order => {
                    const orderDate = new Date(order.orderDate);
                    orderDate.setHours(0, 0, 0, 0); // Normalize to start of day
                    return !isNaN(orderDate) && orderDate <= toDate;
                });
            }
        }
    }

    displayOrders(filteredOrders);
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    const timeFilter = document.getElementById('timeFilter');
    const selectAll = document.getElementById('selectAll');
    const exportBtn = document.getElementById('exportBtn');
    const closeButtons = document.querySelectorAll('.oy-modal-close');

    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            if (e.target.value.length >= 3) {
                searchTimeout = setTimeout(() => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filteredOrders = orders.filter(order => 
                        order.items.some(item => item.name.toLowerCase().includes(searchTerm))
                    );
                    displayOrders(filteredOrders);
                }, 500);
            } else {
                applyFilters(); // Reapply other filters when search is cleared
            }
        });
    } else {
        console.error('Search input element not found');
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    } else {
        console.error('Status filter element not found');
    }

    if (fromDate) {
        fromDate.addEventListener('change', applyFilters);
    } else {
        console.error('From date input element not found');
    }

    if (toDate) {
        toDate.addEventListener('change', applyFilters);
    } else {
        console.error('To date input element not found');
    }

    if (timeFilter) {
        timeFilter.addEventListener('change', applyFilters);
    } else {
        console.error('Time filter element not found');
    }

    if (selectAll) {
        selectAll.addEventListener('change', function(e) {
            document.querySelectorAll('.order-checkbox').forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });
    } else {
        console.error('Select all checkbox not found');
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            const selectedIds = Array.from(document.querySelectorAll('.order-checkbox:checked'))
                .map(cb => parseInt(cb.dataset.id));
            
            const selectedOrders = orders.filter(order => selectedIds.includes(order.orderId));
            
            const csvContent = [
                ['Order ID', 'Customer', 'Phone', 'Items', 'Total', 'Status', 'Order Date', 'Shiprocket ID', 'Payment', 'Pickup', 'Address', 'State', 'Pincode', 'User ID'],
                ...selectedOrders.map(order => [
                    order.orderId,
                    `${order.customerFirstName} ${order.customerLastName || ''}`,
                    order.customerPhone,
                    order.items.map(item => item.name).join('; '),
                    order.total.toFixed(2),
                    order.status,
                    order.orderDate,
                    order.shiprocketOrderId,
                    order.paymentMethod,
                    order.pickupLocation,
                    order.shippingAddress,
                    order.state,
                    order.pincode,
                    order.userId
                ])
            ].map(row => row.join(',')).join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'orders_export.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    } else {
        console.error('Export button not found');
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    fetchData();
});