// Global Variables
let customers = [];
let filteredCustomers = [];
let selectedCustomers = [];
let currentPage = 1;
let customersPerPage = 10;
let searchTimeout;

// API Base URL
const API_BASE_URL = 'https://api.oyjewells.com/api/users';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCustomers();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Search functionality with debounce
    document.getElementById('searchInput').addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchCustomers(e.target.value);
        }, 300);
    });

    // Filter and Reset buttons
    document.getElementById('filterBtn').addEventListener('click', applyFilters);
    document.getElementById('resetBtn').addEventListener('click', resetFilters);

    // File input change
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
}

// Load all customers from API
async function loadCustomers() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/get-all-user`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        customers = data || [];
        filteredCustomers = [...customers];
        
        renderCustomerTable();
        renderPagination();
        showMessage('Customers loaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error loading customers:', error);
        showMessage('Error loading customers. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Search customers by name (3+ characters)
function searchCustomers(query) {
    if (query.length < 3 && query.length > 0) {
        return;
    }
    
    if (query.length === 0) {
        filteredCustomers = [...customers];
    } else {
        filteredCustomers = customers.filter(customer => 
            customer.customerName.toLowerCase().includes(query.toLowerCase()) ||
            customer.email.toLowerCase().includes(query.toLowerCase()) ||
            customer.mobile.includes(query)
        );
    }
    
    currentPage = 1;
    renderCustomerTable();
    renderPagination();
}

// Render customer table
function renderCustomerTable() {
    const tableBody = document.getElementById('customerTableBody');
    const startIndex = (currentPage - 1) * customersPerPage;
    const endIndex = startIndex + customersPerPage;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
    
    if (paginatedCustomers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>No customers found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = paginatedCustomers.map(customer => `
        <tr class="fade-in">
            <td>
                <input type="checkbox" class="customer-checkbox" value="${customer.userId}" 
                       onchange="updateSelectedCustomers(this)">
            </td>
            <td>${customer.userId}</td>
            <td>${customer.customerName}</td>
            <td>${customer.email}</td>
            <td>${customer.mobile}</td>
            <td>${customer.maritalStatus}</td>
            <td>${formatDate(customer.customerDOB)}</td>
            <td>${formatDate(customer.anniversary)}</td>
            <td>
                <span class="status-badge ${customer.status === 'active' ? 'status-active' : 'status-inactive'}">
                    ${customer.status}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editCustomer(${customer.userId})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-delete" onclick="deleteCustomer(${customer.userId})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render pagination
function renderPagination() {
    const paginationContainer = document.getElementById('paginationContainer');
    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `
                <li class="page-item active">
                    <a class="page-link" href="#">${i}</a>
                </li>
            `;
        } else if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        } else if (Math.abs(i - currentPage) === 3) {
            paginationHTML += `
                <li class="page-item disabled">
                    <a class="page-link" href="#">...</a>
                </li>
            `;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;
    }
    
    paginationContainer.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    renderCustomerTable();
    renderPagination();
}

// Toggle select all checkboxes
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.customer-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
    
    updateSelectedCustomersList();
}

// Update selected customers
function updateSelectedCustomers(checkbox) {
    updateSelectedCustomersList();
    
    // Update select all checkbox
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.customer-checkbox');
    const checkedBoxes = document.querySelectorAll('.customer-checkbox:checked');
    
    selectAll.checked = checkboxes.length === checkedBoxes.length;
    selectAll.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < checkboxes.length;
}

// Update selected customers list
function updateSelectedCustomersList() {
    const checkboxes = document.querySelectorAll('.customer-checkbox:checked');
    selectedCustomers = Array.from(checkboxes).map(cb => parseInt(cb.value));
}


// Edit customer
function editCustomer(userId) {
    const customer = customers.find(c => c.userId === userId);
    if (!customer) return;
    
    // Populate edit form
    document.getElementById('editUserId').value = customer.userId;
    document.getElementById('editCustomerName').value = customer.customerName;
    document.getElementById('editEmail').value = customer.email;
    document.getElementById('editMobile').value = customer.mobile;
    document.getElementById('editMaritalStatus').value = customer.maritalStatus;
    document.getElementById('editDOB').value = customer.customerDOB ? customer.customerDOB.split('T')[0] : '';
    document.getElementById('editAnniversary').value = customer.anniversary ? customer.anniversary.split('T')[0] : '';
    document.getElementById('editStatus').value = customer.status;
    
    // Show edit modal
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

// Save customer changes
async function saveCustomer() {
    const userId = document.getElementById('editUserId').value;
    const customerData = {
        userId: parseInt(userId),
        customerName: document.getElementById('editCustomerName').value,
        email: document.getElementById('editEmail').value,
        mobile: document.getElementById('editMobile').value,
        maritalStatus: document.getElementById('editMaritalStatus').value,
        customerDOB: document.getElementById('editDOB').value,
        anniversary: document.getElementById('editAnniversary').value,
        status: document.getElementById('editStatus').value
    };
    
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/update/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Update local data
        const customerIndex = customers.findIndex(c => c.userId === parseInt(userId));
        if (customerIndex !== -1) {
            customers[customerIndex] = customerData;
            filteredCustomers = [...customers];
        }
        
        // Close modal and refresh table
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        editModal.hide();
        
        renderCustomerTable();
        showMessage('Customer updated successfully!', 'success');
        
    } catch (error) {
        console.error('Error updating customer:', error);
        showMessage('Error updating customer. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Delete customer
function deleteCustomer(userId) {
    const customer = customers.find(c => c.userId === userId);
    if (!customer) return;
    
    showConfirmation(
        `Are you sure you want to delete customer "${customer.customerName}"?`,
        () => performDelete(userId)
    );
}

// Perform delete operation
async function performDelete(userId) {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/delete-user/${userId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Remove from local data
        customers = customers.filter(c => c.userId !== userId);
        filteredCustomers = filteredCustomers.filter(c => c.userId !== userId);
        
        renderCustomerTable();
        renderPagination();
        showMessage('Customer deleted successfully!', 'success');
        
    } catch (error) {
        console.error('Error deleting customer:', error);
        showMessage('Error deleting customer. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Apply filters
function applyFilters() {
    // For now, just refresh the current search
    const searchValue = document.getElementById('searchInput').value;
    searchCustomers(searchValue);
}

// Reset filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    filteredCustomers = [...customers];
    currentPage = 1;
    renderCustomerTable();
    renderPagination();
}

// Handle file selection
function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    
    const fileNames = Array.from(files).map(file => file.name).join(', ');
    document.querySelector('.file-drop-text').innerHTML = `
        <i class="fas fa-check-circle text-success"></i><br>
        Selected: ${fileNames}
    `;
}

// Handle import
async function handleImport() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    
    if (files.length === 0) {
        showMessage('Please select files to import.', 'error');
        return;
    }
    
    try {
        showLoading(true);
        
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch(`${API_BASE_URL}/import-users`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        
        // Reload customers after import
        await loadCustomers();
        showMessage('Files imported successfully!', 'success');
        
        // Reset file input
        fileInput.value = '';
        document.querySelector('.file-drop-text').innerHTML = `
            <i class="fas fa-upload"></i><br>
            Click to select files
        `;
        
    } catch (error) {
        console.error('Error importing files:', error);
        showMessage('Error importing files. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Export selected customers to Excel
function exportToExcel() {
    if (selectedCustomers.length === 0) {
        showMessage('Please select customers to export.', 'error');
        return;
    }
    
    const selectedData = customers.filter(customer => 
        selectedCustomers.includes(customer.userId)
    );
    
    exportData(selectedData, 'selected_customers.xlsx');
}

// Export all customers to Excel
function exportAllToExcel() {
    if (customers.length === 0) {
        showMessage('No customers to export.', 'error');
        return;
    }
    
    exportData(customers, 'all_customers.xlsx');
}

// Export data to Excel
function exportData(data, filename) {
    const worksheet = XLSX.utils.json_to_sheet(data.map(customer => ({
        'User ID': customer.userId,
        'Customer Name': customer.customerName,
        'Email': customer.email,
        'Mobile': customer.mobile,
        'Marital Status': customer.maritalStatus,
        'Date of Birth': formatDate(customer.customerDOB),
        'Anniversary': formatDate(customer.anniversary),
        'Status': customer.status
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(workbook, filename);
    
    showMessage(`Data exported to ${filename}`, 'success');
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });
}

// Show loading indicator
function showLoading(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (show) {
        loadingIndicator.style.display = 'block';
    } else {
        loadingIndicator.style.display = 'none';
    }
}

// Show message
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    
    messageContainer.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        const alert = messageContainer.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

// Show confirmation modal
function showConfirmation(message, onConfirm) {
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    const modalBody = document.getElementById('confirmationModalBody');
    const confirmBtn = document.getElementById('confirmActionBtn');
    
    modalBody.textContent = message;
    
    // Remove existing event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // Add new event listener
    newConfirmBtn.addEventListener('click', () => {
        modal.hide();
        onConfirm();
    });
    
    modal.show();
}

 // Navigation functions
        function toggleLeftNav() {
            const leftNav = document.getElementById('leftNavbar');
            const mainContent = document.getElementById('mainContent');
           
            leftNav.classList.toggle('open');
            // mainContent.classList.toggle('shifted');
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