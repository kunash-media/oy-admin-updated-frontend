// Save coupons to localStorage
function saveCoupons(coupons) {
    localStorage.setItem('coupons', JSON.stringify(coupons));
}

// Load coupons from localStorage
function loadCoupons() {
    const coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    return coupons;
}

// Generate random coupon code
function generateCouponCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Update discount suffix based on type
document.getElementById('discountType').addEventListener('change', function() {
    const suffix = this.value === 'percentage' ? '%' : '$';
    document.getElementById('discountSuffix').textContent = suffix;
});

// Generate coupon code button
document.getElementById('generateCodeBtn').addEventListener('click', function() {
    document.getElementById('couponCode').value = generateCouponCode();
});

// Add coupon to storage
document.getElementById('addCouponBtn').addEventListener('click', function() {
    const bannerFile = document.getElementById('couponBanner').files[0];
    if (!bannerFile) {
        alert('Please upload a coupon banner image');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const coupons = loadCoupons();
        const newCoupon = {
            id: Date.now().toString(),
            banner: e.target.result,
            name: document.getElementById('couponName').value,
            code: document.getElementById('couponCode').value,
            validFrom: document.getElementById('validityStart').value,
            validUntil: document.getElementById('validityEnd').value,
            discountType: document.getElementById('discountType').value,
            discountValue: document.getElementById('discountValue').value,
            description: document.getElementById('couponDescription').value,
            createdAt: new Date().toISOString()
        };

        coupons.push(newCoupon);
        saveCoupons(coupons);

        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCouponModal'));
        modal.hide();
        document.getElementById('couponForm').reset();
        document.getElementById('discountSuffix').textContent = '%';
    };
    reader.readAsDataURL(bannerFile);
});

// Initialize date inputs with current time
document.addEventListener('DOMContentLoaded', function() {
    const now = new Date();
    const startDate = now.toISOString().slice(0, 16);
    const endDate = new Date(now.setMonth(now.getMonth() + 1)).toISOString().slice(0, 16);

    document.getElementById('validityStart').value = startDate;
    document.getElementById('validityEnd').value = endDate;
    document.getElementById('couponCode').value = generateCouponCode();
});



document.addEventListener('DOMContentLoaded', function() {
    // Initialize dropdown selections
    document.querySelectorAll('#discountTypeDropdown + .dropdown-menu .dropdown-item:first-child, #statusDropdown + .dropdown-menu .dropdown-item:first-child')
        .forEach(item => item.classList.add('active'));

    document.getElementById('filterBtn').addEventListener('click', function() {
        const discountTypeElement = document.querySelector('#discountTypeDropdown + .dropdown-menu .active');
        const statusElement = document.querySelector('#statusDropdown + .dropdown-menu .active');
        const selectedDiscountType = discountTypeElement ? discountTypeElement.textContent : 'All Types';
        const selectedStatus = statusElement ? statusElement.textContent : 'All Statuses';

        const rows = document.querySelectorAll('.table tbody tr');

        rows.forEach(row => {
            const rowDiscountType = row.cells[4].textContent;
            const rowStatus = row.cells[5].textContent;

            let discountTypeMatch = selectedDiscountType === 'All Types' || rowDiscountType.includes(selectedDiscountType);
            let statusMatch = selectedStatus === 'All Statuses' || rowStatus.includes(selectedStatus);

            row.style.display = (discountTypeMatch && statusMatch) ? '' : 'none';
        });
    });

    document.getElementById('resetBtn').addEventListener('click', function() {
        // Reset dropdown selections
        document.querySelectorAll('#discountTypeDropdown + .dropdown-menu .dropdown-item, #statusDropdown + .dropdown-menu .dropdown-item')
            .forEach(item => item.classList.remove('active'));
        document.querySelectorAll('#discountTypeDropdown + .dropdown-menu .dropdown-item:first-child, #statusDropdown + .dropdown-menu .dropdown-item:first-child')
            .forEach(item => item.classList.add('active'));

        // Show all rows again
        document.querySelectorAll('.table tbody tr').forEach(row => {
            row.style.display = '';
        });
    });

    // Add click handlers for dropdown items
    document.querySelectorAll('#discountTypeDropdown + .dropdown-menu .dropdown-item, #statusDropdown + .dropdown-menu .dropdown-item')
        .forEach(item => {
            item.addEventListener('click', function() {
                this.parentElement.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });
});
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with sample data if localStorage is empty
    initializeSampleData();
    renderProducts();

    // Left nav toggle
    document.getElementById('menuIcon').addEventListener('click', function() {
        const leftNav = document.getElementById('leftNav');
        leftNav.style.display = leftNav.style.display === 'block' ? 'none' : 'block';
    });

    // Profile menu toggle
    document.getElementById('profileIcon').addEventListener('click', function(e) {
        e.stopPropagation();
        const menu = document.getElementById('profileMenu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    // Close profile menu when clicking outside
    document.addEventListener('click', function() {
        document.getElementById('profileMenu').style.display = 'none';
    });

    // Submenu toggles
    document.getElementById('onlineStoreToggle').addEventListener('click', function() {
        const sub = document.getElementById('onlineStoreSub');
        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById('catalogToggle').addEventListener('click', function() {
        const sub = document.getElementById('catalogSub');
        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById('customersToggle').addEventListener('click', function() {
        const sub = document.getElementById('customersSub');
        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
    });

});

function deleteRow(btn) {
    const row = btn.closest('tr');
    const couponId = row.cells[1].textContent;
    document.getElementById('deleteMessage').textContent = `Are you sure you want to delete coupon ${couponId}?`;

    const deleteModal = new bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
    deleteModal.show();

    document.getElementById('confirmDeleteBtn').onclick = function() {
        const coupons = loadCoupons();
        const updatedCoupons = coupons.filter(c => c.id !== couponId);
        saveCoupons(updatedCoupons);
        deleteModal.hide();
    };
}

// Delete selected rows
document.getElementById('deleteSelectedBtn').addEventListener('click', function() {
    const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    if (selectedCheckboxes.length === 0) {
        alert('Please select at least one coupon to delete');
        return;
    }

    document.getElementById('deleteMessage').textContent =
        `Are you sure you want to delete ${selectedCheckboxes.length} selected coupon(s)?`;

    const deleteModal = new bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
    deleteModal.show();

    document.getElementById('confirmDeleteBtn').onclick = function() {
        const couponIds = Array.from(selectedCheckboxes).map(checkbox => {
            return checkbox.closest('tr').cells[1].textContent;
        });

        const coupons = loadCoupons();
        const updatedCoupons = coupons.filter(c => !couponIds.includes(c.id));
        saveCoupons(updatedCoupons);
        deleteModal.hide();
    };
});

// Function to render coupons in the table
function renderCoupons() {
    const coupons = loadCoupons();
    const tableBody = document.getElementById('couponsTableBody');
    tableBody.innerHTML = '';

    if (coupons.length === 0) {
        tableBody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center py-4">No coupons found. Click "Add Coupons" to create one.</td>
                </tr>
            `;
        return;
    }

    coupons.forEach(coupon => {
        // Determine status based on dates
        const now = new Date();
        const validFrom = new Date(coupon.validFrom);
        const validUntil = new Date(coupon.validUntil);

        let status = 'Active';
        let statusClass = 'badge bg-success';

        if (now < validFrom) {
            status = 'Upcoming';
            statusClass = 'badge bg-info';
        } else if (now > validUntil) {
            status = 'Expired';
            statusClass = 'badge bg-danger';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
                <td><input type="checkbox"></td>
                <td>${coupon.code}</td>
                <td>${coupon.name}</td>
                <td>${coupon.description || '-'}</td>
                <td>${coupon.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}</td>
                <td><span class="${statusClass}">${status}</span></td>
                <td>${formatDate(coupon.validFrom)}</td>
                <td>${formatDate(coupon.validUntil)}</td>
                <td>${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : '$'}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary me-1" title="Edit">
                    <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="Delete" onclick="deleteCoupon('${coupon.id}')">
                    <i class="fas fa-trash"></i>
                    </button>
                    </td>
            `;
        tableBody.appendChild(row);
    });
}

// Helper function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to delete a coupon
function deleteCoupon(id) {
    if (confirm('Are you sure you want to delete this coupon?')) {
        const coupons = loadCoupons();
        const updatedCoupons = coupons.filter(c => c.id !== id);
        saveCoupons(updatedCoupons);
        renderCoupons();
    }
}

// Initialize sample data if empty
function initializeSampleData() {
    if (loadCoupons().length === 0) {
        const sampleCoupons = [{
                id: '1',
                banner: '',
                name: 'Summer Sale',
                code: 'SUMMER20',
                validFrom: new Date(Date.now() - 86400000).toISOString(),
                validUntil: new Date(Date.now() + 86400000 * 30).toISOString(),
                discountType: 'percentage',
                discountValue: '20',
                description: 'Summer season discount',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                banner: '',
                name: 'New Year Special',
                code: 'NEWYEAR50',
                validFrom: new Date(Date.now() + 86400000 * 10).toISOString(),
                validUntil: new Date(Date.now() + 86400000 * 40).toISOString(),
                discountType: 'fixed',
                discountValue: '50',
                description: 'New Year special discount',
                createdAt: new Date().toISOString()
            }
        ];
        saveCoupons(sampleCoupons);
    }
}

// Select all checkboxes
document.getElementById('selectAll').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('#couponsTableBody input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});

// Update the DOMContentLoaded event to include renderCoupons
document.addEventListener('DOMContentLoaded', function() {
    initializeSampleData();
    renderCoupons();

    // ... (rest of your existing DOMContentLoaded code)
});

// Update the addCouponBtn event listener to render after adding
document.getElementById('addCouponBtn').addEventListener('click', function() {
    const bannerFile = document.getElementById('couponBanner').files[0];
    if (!bannerFile) {
        alert('Please upload a coupon banner image');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const coupons = loadCoupons();
        const newCoupon = {
            id: Date.now().toString(),
            banner: e.target.result,
            name: document.getElementById('couponName').value,
            code: document.getElementById('couponCode').value,
            validFrom: document.getElementById('validityStart').value,
            validUntil: document.getElementById('validityEnd').value,
            discountType: document.getElementById('discountType').value,
            discountValue: document.getElementById('discountValue').value,
            description: document.getElementById('couponDescription').value,
            createdAt: new Date().toISOString()
        };

        coupons.push(newCoupon);
        saveCoupons(coupons);

        // Close modal, reset form, and refresh table
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCouponModal'));
        modal.hide();
        document.getElementById('couponForm').reset();
        document.getElementById('discountSuffix').textContent = '%';
        renderCoupons();
    };
    reader.readAsDataURL(bannerFile);
});

function renderCoupons() {
    const coupons = loadCoupons();
    const tableBody = document.getElementById('couponsTableBody');
    tableBody.innerHTML = '';

    if (coupons.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center py-4">No coupons found. Click "Add Coupons" to create one.</td>
            </tr>
        `;
        return;
    }

    coupons.forEach(coupon => {
        // Determine status based on dates
        const now = new Date();
        const validFrom = new Date(coupon.validFrom);
        const validUntil = new Date(coupon.validUntil);

        let status = 'Active';
        let statusClass = 'badge bg-success';

        if (now < validFrom) {
            status = 'Upcoming';
            statusClass = 'badge bg-info';
        } else if (now > validUntil) {
            status = 'Expired';
            statusClass = 'badge bg-danger';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${coupon.code}</td>
            <td>${coupon.name}</td>
            <td>${coupon.description || '-'}</td>
            <td>${coupon.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}</td>
            <td><span class="${statusClass}">${status}</span></td>
            <td>${formatDate(coupon.validFrom)}</td>
            <td>${formatDate(coupon.validUntil)}</td>
            <td>${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : '$'}</td>
            <td class="text-center">
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="Delete" onclick="deleteCoupon('${coupon.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Add coupon to storage
document.getElementById('addCouponBtn').addEventListener('click', function() {
    const bannerFile = document.getElementById('couponBanner').files[0];
    if (!bannerFile) {
        alert('Please upload a coupon banner image');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const coupons = loadCoupons();
        const newCoupon = {
            id: Date.now().toString(),
            banner: e.target.result,
            name: document.getElementById('couponName').value,
            code: document.getElementById('couponCode').value,
            validFrom: document.getElementById('validityStart').value,
            validUntil: document.getElementById('validityEnd').value,
            discountType: document.getElementById('discountType').value,
            discountValue: document.getElementById('discountValue').value,
            description: document.getElementById('couponDescription').value,
            createdAt: new Date().toISOString()
        };

        coupons.push(newCoupon);
        saveCoupons(coupons);
        renderCoupons(); // Add this line to refresh the table

        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCouponModal'));
        modal.hide();
        document.getElementById('couponForm').reset();
        document.getElementById('discountSuffix').textContent = '%';
    };
    reader.readAsDataURL(bannerFile);
});



// Add this function to handle multiple row deletion
function deleteSelectedRows() {
    const checkboxes = document.querySelectorAll('#couponsTableBody input[type="checkbox"]:checked');
    if (checkboxes.length === 0) {
        alert('Please select at least one coupon to delete');
        return;
    }

    // Show confirmation modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    document.getElementById('deleteMessage').textContent =
        `Are you sure you want to delete ${checkboxes.length} selected coupon(s)?`;
    deleteModal.show();

    // Set up confirm button handler
    document.getElementById('confirmDeleteBtn').onclick = function() {
        const coupons = loadCoupons();
        const selectedIds = Array.from(checkboxes).map(checkbox => {
            return checkbox.closest('tr').querySelector('td:nth-child(3)').textContent; // Get coupon code from 3rd column
        });

        // Filter out the selected coupons
        const updatedCoupons = coupons.filter(coupon => !selectedIds.includes(coupon.code));
        saveCoupons(updatedCoupons);

        // Refresh the table
        renderCoupons();
        deleteModal.hide();

        // Uncheck the "select all" checkbox
        document.getElementById('selectAll').checked = false;
    };
}

// Update the DOMContentLoaded event to add the click handler
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing DOMContentLoaded code ...

    // Add click handler for delete selected button
    document.getElementById('deleteSelectedBtn').addEventListener('click', deleteSelectedRows);

    // Update the select all checkbox functionality
    document.getElementById('selectAll').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('#couponsTableBody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
});

// Update the renderCoupons function to include proper checkbox handling
function renderCoupons() {
    const coupons = loadCoupons();
    const tableBody = document.getElementById('couponsTableBody');
    tableBody.innerHTML = '';

    if (coupons.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="11" class="text-center py-4">No coupons found. Click "Add Coupons" to create one.</td>
            </tr>
        `;
        return;
    }

    coupons.forEach(coupon => {
                // Determine status based on dates
                const now = new Date();
                const validFrom = new Date(coupon.validFrom);
                const validUntil = new Date(coupon.validUntil);

                let status = 'Active';
                let statusClass = 'badge bg-success';

                if (now < validFrom) {
                    status = 'Upcoming';
                    statusClass = 'badge bg-info';
                } else if (now > validUntil) {
                    status = 'Expired';
                    statusClass = 'badge bg-danger';
                }

                const row = document.createElement('tr');
                row.innerHTML = `
            <td><input type="checkbox"></td>
            <td>
                ${coupon.banner ? 
                    `<img src="${coupon.banner}" alt="Coupon Banner" style="width: 80px; height: 30px; object-fit: cover;">` : 
                    'No Banner'}
            </td>
            <td>${coupon.code}</td>
            <td>${coupon.name}</td>
            <td>${coupon.description || '-'}</td>
            <td>${coupon.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}</td>
            <td><span class="${statusClass}">${status}</span></td>
            <td>${formatDate(coupon.validFrom)}</td>
            <td>${formatDate(coupon.validUntil)}</td>
            <td>${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : '$'}</td>
            <td class="text-center">
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" title="Edit" onclick="handleEditCoupon('${coupon.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="Delete" onclick="deleteCoupon('${coupon.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}
// Function to handle edit button click
function handleEditCoupon(couponId) {
    const coupons = loadCoupons();
    const couponToEdit = coupons.find(c => c.id === couponId);
    
    if (!couponToEdit) return;

    // Fill the modal with coupon data
    document.getElementById('couponName').value = couponToEdit.name;
    document.getElementById('couponCode').value = couponToEdit.code;
    document.getElementById('validityStart').value = couponToEdit.validFrom.slice(0, 16);
    document.getElementById('validityEnd').value = couponToEdit.validUntil.slice(0, 16);
    document.getElementById('discountType').value = couponToEdit.discountType;
    document.getElementById('discountValue').value = couponToEdit.discountValue;
    document.getElementById('couponDescription').value = couponToEdit.description || '';
    document.getElementById('discountSuffix').textContent = couponToEdit.discountType === 'percentage' ? '%' : '$';

    // Change modal title and button
    document.getElementById('addCouponModalLabel').textContent = 'Edit Coupon';
    const addBtn = document.getElementById('addCouponBtn');
    addBtn.textContent = 'Update Coupon';
    addBtn.onclick = function() {
        updateCoupon(couponId);
    };

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('addCouponModal'));
    modal.show();
}

// Function to update coupon
function updateCoupon(couponId) {
    const bannerFile = document.getElementById('couponBanner').files[0];
    const coupons = loadCoupons();
    const couponIndex = coupons.findIndex(c => c.id === couponId);
    
    if (couponIndex === -1) return;

    if (bannerFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            updateCouponData(couponId, couponIndex, coupons, e.target.result);
        };
        reader.readAsDataURL(bannerFile);
    } else {
        // Keep the existing banner if no new file is selected
        updateCouponData(couponId, couponIndex, coupons, coupons[couponIndex].banner);
    }
}

// Helper function to update coupon data
function updateCouponData(couponId, couponIndex, coupons, bannerData) {
    coupons[couponIndex] = {
        id: couponId,
        banner: bannerData,
        name: document.getElementById('couponName').value,
        code: document.getElementById('couponCode').value,
        validFrom: document.getElementById('validityStart').value,
        validUntil: document.getElementById('validityEnd').value,
        discountType: document.getElementById('discountType').value,
        discountValue: document.getElementById('discountValue').value,
        description: document.getElementById('couponDescription').value,
        createdAt: coupons[couponIndex].createdAt // Keep original creation date
    };

    saveCoupons(coupons);
    
    // Reset modal and refresh table
    const modal = bootstrap.Modal.getInstance(document.getElementById('addCouponModal'));
    modal.hide();
    document.getElementById('couponForm').reset();
    document.getElementById('discountSuffix').textContent = '%';
    
    // Reset modal title and button
    document.getElementById('addCouponModalLabel').textContent = 'Add New Coupon';
    const addBtn = document.getElementById('addCouponBtn');
    addBtn.textContent = 'Add Coupon';
    addBtn.onclick = function() {
        // Your existing add coupon functionality
        const bannerFile = document.getElementById('couponBanner').files[0];
        if (!bannerFile) {
            alert('Please upload a coupon banner image');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const coupons = loadCoupons();
            const newCoupon = {
                id: Date.now().toString(),
                banner: e.target.result,
                name: document.getElementById('couponName').value,
                code: document.getElementById('couponCode').value,
                validFrom: document.getElementById('validityStart').value,
                validUntil: document.getElementById('validityEnd').value,
                discountType: document.getElementById('discountType').value,
                discountValue: document.getElementById('discountValue').value,
                description: document.getElementById('couponDescription').value,
                createdAt: new Date().toISOString()
            };

            coupons.push(newCoupon);
            saveCoupons(coupons);
            renderCoupons();

            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('addCouponModal'));
            modal.hide();
            document.getElementById('couponForm').reset();
            document.getElementById('discountSuffix').textContent = '%';
        };
        reader.readAsDataURL(bannerFile);
    };
    
    renderCoupons();
}

// Left nav toggle
document.getElementById('menuIcon').addEventListener('click', function() {
    const leftNav = document.getElementById('leftNav');
    leftNav.style.display = leftNav.style.display === 'block' ? 'none' : 'block';
});

// Profile menu toggle
document.getElementById('profileIcon').addEventListener('click', function(e) {
    e.stopPropagation();
    const menu = document.getElementById('profileMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

// Close profile menu when clicking outside
document.addEventListener('click', function() {
    document.getElementById('profileMenu').style.display = 'none';
});

// Submenu toggles
document.getElementById('onlineStoreToggle').addEventListener('click', function() {
    const sub = document.getElementById('onlineStoreSub');
    sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('catalogToggle').addEventListener('click', function() {
    const sub = document.getElementById('catalogSub');
    sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('customersToggle').addEventListener('click', function() {
    const sub = document.getElementById('customersSub');
    sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
});


document.addEventListener('DOMContentLoaded', function() {
    const leftNav = document.getElementById('leftNav');
    leftNav.style.display = 'block';
    
    // Initialize with sample data if localStorage is empty
    initializeSampleData();
    renderCoupons();
});


// Filter functionality
document.getElementById('filterBtn').addEventListener('click', function() {
    const searchTerm = document.querySelector('.search-box input').value.toLowerCase();
    const discountType = document.querySelector('#discountTypeDropdown + .dropdown-menu .active').textContent;
    const status = document.querySelector('#statusDropdown + .dropdown-menu .active').textContent;
    
    const rows = document.querySelectorAll('#couponsTableBody tr');
    
    rows.forEach(row => {
        const couponName = row.cells[2].textContent.toLowerCase();
        const rowDiscountType = row.cells[5].textContent;
        const rowStatus = row.cells[6].textContent;
        
        const nameMatch = searchTerm === '' || couponName.includes(searchTerm);
        const typeMatch = discountType === 'All Types' || rowDiscountType.includes(discountType);
        const statusMatch = status === 'All Statuses' || rowStatus.includes(status);
        
        row.style.display = (nameMatch && typeMatch && statusMatch) ? '' : 'none';
    });
});

// Reset functionality
document.getElementById('resetBtn').addEventListener('click', function() {
    // Reset search input
    document.querySelector('.search-box input').value = '';
    
    // Reset dropdown selections
    document.querySelectorAll('#discountTypeDropdown + .dropdown-menu .dropdown-item, #statusDropdown + .dropdown-menu .dropdown-item')
        .forEach(item => item.classList.remove('active'));
    document.querySelectorAll('#discountTypeDropdown + .dropdown-menu .dropdown-item:first-child, #statusDropdown + .dropdown-menu .dropdown-item:first-child')
        .forEach(item => item.classList.add('active'));
    
    // Show all rows
    document.querySelectorAll('#couponsTableBody tr').forEach(row => {
        row.style.display = '';
    });
});

// Add this script to enable all filter functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dropdown selections
    document.querySelectorAll('#discountTypeDropdown + .dropdown-menu .dropdown-item:first-child, #statusDropdown + .dropdown-menu .dropdown-item:first-child')
        .forEach(item => item.classList.add('active'));

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('#couponsTableBody tr');
        
        rows.forEach(row => {
            const couponCode = row.cells[2].textContent.toLowerCase();
            const couponName = row.cells[3].textContent.toLowerCase();
            const couponDesc = row.cells[4].textContent.toLowerCase();
            
            const matches = couponCode.includes(searchTerm) || 
                          couponName.includes(searchTerm) || 
                          couponDesc.includes(searchTerm);
            
            row.style.display = matches ? '' : 'none';
        });
    }
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Dropdown selection handlers
    document.querySelectorAll('#discountTypeDropdown + .dropdown-menu .dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('discountTypeDropdown').textContent = this.textContent;
        });
    });

    document.querySelectorAll('#statusDropdown + .dropdown-menu .dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('statusDropdown').textContent = this.textContent;
        });
    });

    // Filter button functionality
    document.getElementById('filterBtn').addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const discountType = document.querySelector('#discountTypeDropdown + .dropdown-menu .active').textContent;
        const status = document.querySelector('#statusDropdown + .dropdown-menu .active').textContent;
        
        const rows = document.querySelectorAll('#couponsTableBody tr');
        
        rows.forEach(row => {
            const couponCode = row.cells[2].textContent.toLowerCase();
            const couponName = row.cells[3].textContent.toLowerCase();
            const couponDesc = row.cells[4].textContent.toLowerCase();
            const rowDiscountType = row.cells[5].textContent;
            const rowStatus = row.cells[6].textContent;
            
            const nameMatch = searchTerm === '' || 
                            couponCode.includes(searchTerm) || 
                            couponName.includes(searchTerm) || 
                            couponDesc.includes(searchTerm);
            const typeMatch = discountType === 'All Types' || rowDiscountType.includes(discountType);
            const statusMatch = status === 'All Statuses' || rowStatus.includes(status);
            
            row.style.display = (nameMatch && typeMatch && statusMatch) ? '' : 'none';
        });
    });

    // Reset button functionality
    document.getElementById('resetBtn').addEventListener('click', function() {
        // Reset search input
        searchInput.value = '';
        
        // Reset dropdown selections
        document.querySelectorAll('#discountTypeDropdown + .dropdown-menu .dropdown-item, #statusDropdown + .dropdown-menu .dropdown-item')
            .forEach(item => item.classList.remove('active'));
        document.querySelectorAll('#discountTypeDropdown + .dropdown-menu .dropdown-item:first-child, #statusDropdown + .dropdown-menu .dropdown-item:first-child')
            .forEach(item => item.classList.add('active'));
        
        // Reset dropdown button text
        document.getElementById('discountTypeDropdown').textContent = 'Discount Type';
        document.getElementById('statusDropdown').textContent = 'Status';
        
        // Show all rows
        document.querySelectorAll('#couponsTableBody tr').forEach(row => {
            row.style.display = '';
        });
    });
});

    // Export functionality
    document.addEventListener('DOMContentLoaded', function() {
        // Add event listeners to export dropdown items
        document.querySelectorAll('.dropdown-item').forEach(item => {
            if (item.textContent.includes('Excel')) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    exportToExcel();
                });
            } else if (item.textContent.includes('CSV')) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    exportToCSV();
                });
            }
        });

        function exportToExcel() {
            try {
                // Get the table element
                const table = document.querySelector('.table-container table');
                
                // Create a workbook with the table data
                const workbook = XLSX.utils.table_to_book(table, {sheet: "Coupons"});
                
                // Generate Excel file and trigger download
                XLSX.writeFile(workbook, 'coupons_export.xlsx');
            } catch (error) {
                console.error('Error exporting to Excel:', error);
                alert('Error exporting to Excel. Please try again.');
            }
        }

        function exportToCSV() {
            try {
                // Get the table element
                const table = document.querySelector('.table-container table');
                
                // Convert table to worksheet
                const worksheet = XLSX.utils.table_to_sheet(table);
                
                // Convert worksheet to CSV
                const csv = XLSX.utils.sheet_to_csv(worksheet);
                
                // Create download link
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "coupons_export.csv");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Error exporting to CSV:', error);
                alert('Error exporting to CSV. Please try again.');
            }
        }
    });