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

document.addEventListener('DOMContentLoaded', function() {

  //------------------------- coupon js code  --------------------------//

    const apiBaseUrl = 'https://api.oyjewells.com/api';
    let allUsers = [];
    let categories = ['rings', 'necklaces', 'bracelets', 'hair accessories', 'chains', 'mangalsutra', 'earrings'];

    // Parse query parameters for username
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return Object.fromEntries(params.entries());
    }

    const params = getQueryParams();
    if (params.user) {
        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) {
            usernameDisplay.textContent = params.user;
        }
    }

    // Show alert with Bootstrap styling
    function showAlert(message, type = 'danger') {
        const alertContainer = document.createElement('div');
        alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
        alertContainer.role = 'alert';
        alertContainer.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.querySelector('.main-content').prepend(alertContainer);
        setTimeout(() => alertContainer.remove(), 5000);
    }

    // Fetch all users
    async function fetchUsers() {
        try {
            const response = await fetch(`${apiBaseUrl}/users/get-all-user`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allUsers = await response.json();
            populateTable(allUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            showAlert('Error fetching users: ' + error.message, 'danger');
        }
    }

    // Populate table with users
    function populateTable(users) {
        const tbody = document.getElementById('userTableBody');
        if (!tbody) {
            console.error('userTableBody not found');
            return;
        }
        tbody.innerHTML = '';
        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="11" class="text-center text-muted">No users found</td></tr>';
            return;
        }
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="form-check-input row-checkbox" data-user-id="${user.userId}"></td>
                <td>${user.userId || '-'}</td>
                <td>${user.customerFirstName || '-'}</td>
                <td>${user.customerLastName || '-'}</td>
                <td>${user.email || '-'}</td>
                <td>${user.mobile || '-'}</td>
                <td>${user.maritalStatus || '-'}</td>
                <td>${user.customerDOB ? new Date(user.customerDOB).toLocaleDateString() : '-'}</td>
                <td>${user.anniversary ? new Date(user.anniversary).toLocaleDateString() : '-'}</td>
                <td>${user.status || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary view-coupons" data-user-id="${user.userId}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Filter users based on selection
    document.getElementById('filterBtn')?.addEventListener('click', function() {
        const selectedFilter = document.getElementById('filterDropdown')?.textContent.trim() || '';
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);

        let filteredUsers = [];
        if (selectedFilter === 'Next Month Birthday') {
            filteredUsers = allUsers.filter(user => {
                if (!user.customerDOB) return false;
                const dob = new Date(user.customerDOB);
                return dob.getMonth() === nextMonth.getMonth() && dob.getDate() >= today.getDate();
            });
        } else if (selectedFilter === 'Next Month Anniversary') {
            filteredUsers = allUsers.filter(user => {
                if (!user.anniversary) return false;
                const anniversary = new Date(user.anniversary);
                return anniversary.getMonth() === nextMonth.getMonth() && anniversary.getDate() >= today.getDate();
            });
        } else if (selectedFilter === 'Event') {
            filteredUsers = allUsers;
        } else {
            filteredUsers = allUsers;
        }
        populateTable(filteredUsers);
    });

    // Reset filter
    document.getElementById('resetBtn')?.addEventListener('click', function() {
        const filterDropdown = document.getElementById('filterDropdown');
        if (filterDropdown) filterDropdown.textContent = 'Filter By';
        populateTable(allUsers);
    });

    // Handle filter dropdown selection
    document.querySelectorAll('#filterOptions .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const filterDropdown = document.getElementById('filterDropdown');
            if (filterDropdown) filterDropdown.textContent = this.textContent;
        });
    });

    // Show/hide custom category input
    document.getElementById('couponCategory')?.addEventListener('change', function() {
        const customCategoryDiv = document.getElementById('customCategoryDiv');
        if (customCategoryDiv) {
            customCategoryDiv.style.display = this.value === 'other' ? 'block' : 'none';
        }
    });

    // Add new category
    document.getElementById('addCategoryBtn')?.addEventListener('click', function() {
        const customCategoryInput = document.getElementById('customCategory');
        const newCategory = customCategoryInput?.value.trim();
        if (newCategory && !categories.includes(newCategory)) {
            categories.push(newCategory);
            const select = document.getElementById('couponCategory');
            if (select) {
                const option = new Option(newCategory, newCategory);
                select.add(option);
                select.value = newCategory;
                document.getElementById('customCategoryDiv').style.display = 'none';
                customCategoryInput.value = '';
            }
        } else if (!newCategory) {
            showAlert('Please enter a valid category name', 'warning');
        } else {
            showAlert('Category already exists', 'warning');
        }
    });

    // Generate coupon code
    function generateCouponCode(eventType) {
        if (!eventType) return '';
        const eventPrefix = eventType.trim().slice(0, 3).toUpperCase().padEnd(3, 'X');
        const year = new Date().getFullYear().toString().slice(-2);
        return `${eventPrefix}${year}${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Update coupon code preview
    function updateCouponCode() {
        const eventType = document.getElementById('eventType')?.value || '';
        const couponCodeInput = document.getElementById('couponCode');
        if (couponCodeInput) {
            couponCodeInput.value = generateCouponCode(eventType);
        }
    }

    // Attach event listener to eventType input
    document.getElementById('eventType')?.addEventListener('input', updateCouponCode);

    // Show coupon modal
    document.getElementById('createCouponBtn')?.addEventListener('click', function() {
        const modalElement = document.getElementById('couponModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement, { keyboard: false });
            modal.show();
            updateCouponCode(); // Initialize coupon code
        }
    });

    // Validate coupon data
    function validateCouponData(couponData) {
        const errors = [];
        if (!couponData.eventType?.trim()) errors.push('Event type is required');
        if (!couponData.couponDescription?.trim()) errors.push('Coupon description is required');
        if (!couponData.couponDiscount || isNaN(couponData.couponDiscount) || couponData.couponDiscount <= 0 || couponData.couponDiscount > 100) {
            errors.push('Coupon discount must be between 1 and 100');
        }
        if (!couponData.validFromDate) errors.push('Valid from date is required');
        if (!couponData.validUntilDate) errors.push('Valid until date is required');
        if (couponData.validFromDate && couponData.validUntilDate) {
            const fromDate = new Date(couponData.validFromDate);
            const untilDate = new Date(couponData.validUntilDate);
            if (fromDate >= untilDate) {
                errors.push('Valid until date must be after valid from date');
            }
        }
        if (!couponData.couponCode?.trim()) errors.push('Coupon code is required');
        if (!couponData.category?.length || !couponData.category[0]?.trim()) {
            errors.push('Category is required');
        }
        if (!couponData.userIds?.length) errors.push('At least one user must be selected');
        return errors;
    }

    // Handle error response
    async function handleErrorResponse(response) {
        let errorMessage = `HTTP ${response.status} - ${response.statusText}`;
        try {
            const contentType = response.headers.get('content-type');
            if (!contentType || response.headers.get('content-length') === '0') {
                if (response.status === 400) {
                    errorMessage = 'Bad Request: Invalid request format or server validation error.';
                } else if (response.status === 403) {
                    errorMessage = 'Forbidden: Invalid credentials or insufficient permissions.';
                }
                return errorMessage;
            }
            if (contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorData.details || 
                               (errorData.errors?.join(', ')) || JSON.stringify(errorData);
            } else {
                errorMessage = await response.text() || errorMessage;
            }
        } catch (parseError) {
            console.error('Error parsing response:', parseError);
        }
        return errorMessage.trim();
    }

    // Apply coupon to selected users
    document.getElementById('applyCouponBtn')?.addEventListener('click', async function() {
        this.disabled = true;
        const selectedUsers = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => cb.dataset.userId);
        if (selectedUsers.length === 0) {
            showAlert('Please select at least one user', 'warning');
            this.disabled = false;
            return;
        }

        const userIds = selectedUsers
            .filter(id => id?.trim())
            .map(id => parseInt(id.trim(), 10))
            .filter(id => !isNaN(id));

        if (userIds.length === 0) {
            showAlert('No valid user IDs found', 'warning');
            this.disabled = false;
            return;
        }

        const couponData = {
            eventType: document.getElementById('eventType')?.value?.trim() || '',
            couponDescription: document.getElementById('couponDescription')?.value?.trim() || '',
            couponDiscount: parseFloat(document.getElementById('couponDiscount')?.value || 0),
            validFromDate: document.getElementById('validFromDate')?.value || '',
            validUntilDate: document.getElementById('validUntilDate')?.value || '',
            couponCode: document.getElementById('couponCode')?.value?.trim() || '',
            category: [document.getElementById('couponCategory')?.value?.trim() || ''],
            userIds
        };

        const validationErrors = validateCouponData(couponData);
        if (validationErrors.length > 0) {
            showAlert('Please fix the following errors:\n' + validationErrors.join('\n'), 'danger');
            this.disabled = false;
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/coupons/bulk-create`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(couponData)
            });

            if (response.ok) {
                const result = await response.json();
                showAlert('Coupons applied successfully', 'success');
                const modal = bootstrap.Modal.getInstance(document.getElementById('couponModal'));
                modal?.hide();
                document.getElementById('couponForm')?.reset();
                document.getElementById('couponCode').value = '';
                document.getElementById('customCategoryDiv').style.display = 'none';
                document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
                document.getElementById('selectAll').checked = false;
                await checkAndDisableCoupons(userIds);
            } else {
                const errorMessage = await handleErrorResponse(response);
                showAlert(`Error applying coupons: ${errorMessage}`, 'danger');
            }
        } catch (error) {
            console.error('Network error:', error);
            showAlert('Network error applying coupons. Please check your connection.', 'danger');
        } finally {
            this.disabled = false;
        }
    });

    // Check and disable conflicting coupons
    async function checkAndDisableCoupons(userIds) {
        for (const userId of userIds) {
            try {
                const response = await fetch(`${apiBaseUrl}/coupons/user/${userId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                });
                if (!response.ok) {
                    console.error(`Error fetching coupons for user ${userId}:`, response.status);
                    continue;
                }
                const userCoupons = await response.json();
                if (userCoupons.userCoupons?.length > 1) {
                    const validCoupon = userCoupons.userCoupons.find(c => c.status === 'valid');
                    if (validCoupon) {
                        const otherCoupons = userCoupons.userCoupons.filter(c => c.couponId !== validCoupon.couponId);
                        for (const coupon of otherCoupons) {
                            try {
                                await fetch(`${apiBaseUrl}/coupons/${coupon.couponId}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                                    body: JSON.stringify({ ...coupon, status: 'invalid' })
                                });
                            } catch (updateError) {
                                console.error(`Error updating coupon ${coupon.couponId}:`, updateError);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`Error processing coupons for user ${userId}:`, error);
            }
        }
    }

    // View user coupons
    document.getElementById('userTableBody')?.addEventListener('click', async function(e) {
        const viewButton = e.target.closest('.view-coupons');
        if (!viewButton) return;
        const userId = viewButton.dataset.userId;
        try {
            const response = await fetch(`${apiBaseUrl}/coupons/user/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            });
            if (!response.ok) {
                const errorMessage = await handleErrorResponse(response);
                throw new Error(errorMessage);
            }
            const userCoupons = await response.json();
            const couponDetailsDiv = document.getElementById('couponDetails');
            if (!couponDetailsDiv) return;
            couponDetailsDiv.innerHTML = '';
            if (userCoupons.userCoupons?.length > 0) {
                userCoupons.userCoupons.forEach(coupon => {
                    const couponCard = document.createElement('div');
                    couponCard.className = 'card mb-3';
                    couponCard.innerHTML = `
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label fw-bold">Coupon Code</label>
                                <input type="text" class="form-control" value="${coupon.couponCode || '-'}" readonly>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Description</label>
                                <input type="text" class="form-control" value="${coupon.couponDescription || '-'}" readonly>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Discount (%)</label>
                                <input type="text" class="form-control" value="${coupon.couponDiscount || '-'}" readonly>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Category</label>
                                <input type="text" class="form-control" value="${coupon.category?.join(', ') || '-'}" readonly>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Valid From</label>
                                <input type="text" class="form-control" value="${coupon.validFromDate ? new Date(coupon.validFromDate).toLocaleDateString() : '-'}" readonly>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Valid Until</label>
                                <input type="text" class="form-control" value="${coupon.validUntilDate ? new Date(coupon.validUntilDate).toLocaleDateString() : '-'}" readonly>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Status</label>
                                <input type="text" class="form-control" value="${coupon.status || '-'}" readonly>
                            </div>
                        </div>
                    `;
                    couponDetailsDiv.appendChild(couponCard);
                });
            } else {
                couponDetailsDiv.innerHTML = '<p class="text-muted">No coupons found for this user.</p>';
            }
            const modalElement = document.getElementById('viewCouponModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement, { keyboard: false });
                modal.show();
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
            showAlert('Error fetching coupons: ' + error.message, 'danger');
        }
    });

    // Select all checkboxes
    document.getElementById('selectAll')?.addEventListener('click', function() {
        document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = this.checked);
    });

    // Initial fetch
    fetchUsers();
});