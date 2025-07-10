// Global variables
let staffData = [];
let filteredStaffData = [];
let currentEditingStaffId = null;
const API_BASE_URL = 'http://localhost:8080/api/staff';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadStaffData();
    setupEventListeners();
    hideLoading();
});

// Setup event listeners
function setupEventListeners() {
    // Form submission handlers
    document.getElementById('saveStaffBtn').addEventListener('click', handleAddStaff);
    document.getElementById('updateStaffBtn').addEventListener('click', handleUpdateStaff);
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDeleteStaff);
    
    // Search and filter handlers
    document.getElementById('searchInput').addEventListener('input', filterTable);
    document.getElementById('roleFilter').addEventListener('change', filterTable);
    
    // Image preview handlers
    document.getElementById('staffImage').addEventListener('change', previewImage);
    document.getElementById('editStaffImage').addEventListener('change', previewEditImage);
    
    // Form validation
    document.getElementById('staffForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleAddStaff();
    });
    
    document.getElementById('editStaffForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleUpdateStaff();
    });
}

// Loading functions
function showLoading() {
    document.getElementById('loadingIndicator').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingIndicator').style.display = 'none';
}

// Message display functions
function showMessage(message, type = 'success') {
    const messageContainer = document.getElementById('messageContainer');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    
    messageContainer.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        const alert = messageContainer.querySelector('.alert');
        if (alert) {
            alert.classList.remove('show');
            setTimeout(() => {
                messageContainer.innerHTML = '';
            }, 300);
        }
    }, 5000);
}

// API Functions
async function loadStaffData() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/get-all-staff`);
        
        if (!response.ok) {
            throw new Error('Failed to load staff data');
        }
        
        const data = await response.json();
        staffData = data || [];
        filteredStaffData = [...staffData];
        renderStaffTable();
    } catch (error) {
        console.error('Error loading staff data:', error);
        showMessage('Failed to load staff data. Please try again.', 'error');
        staffData = [];
        filteredStaffData = [];
        renderStaffTable();
    } finally {
        hideLoading();
    }
}

async function createStaff(formData) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create staff');
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating staff:', error);
        throw error;
    } finally {
        hideLoading();
    }
}

async function getStaffById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/get-staff/${id}`);
        
        if (!response.ok) {
            throw new Error('Failed to get staff data');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting staff by ID:', error);
        throw error;
    }
}

async function updateStaff(id, formData) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/update/${id}`, {
            method: 'PATCH',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update staff');
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating staff:', error);
        throw error;
    } finally {
        hideLoading();
    }
}

async function deleteStaff(id) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete staff');
        }
        
        return true;
    } catch (error) {
        console.error('Error deleting staff:', error);
        throw error;
    } finally {
        hideLoading();
    }
}

async function handleAddStaff() {
    try {
        // Validate form
        if (!validateStaffForm()) {
            return;
        }
        
        const formData = new FormData();
        
        // Create staff data object
        const staffData = {
            staffName: document.getElementById('staffName').value.trim(),
            emailAddress: document.getElementById('staffEmail').value.trim(),
            password: document.getElementById('staffPassword').value,
            contactNumber: document.getElementById('staffContact').value.trim(),
            joiningDate: document.getElementById('joiningDate').value,
            staffRole: document.getElementById('staffRole').value
        };
        
        // Append staffData as JSON string with the key 'staffData'
        formData.append('staffData', new Blob([JSON.stringify(staffData)], {
            type: 'application/json'
        }));
        
        // Append image file with the key 'staffImage'
        const imageFile = document.getElementById('staffImage').files[0];
        if (imageFile) {
            formData.append('staffImage', imageFile);
        }
        
        // Create staff with proper headers
        await createStaff(formData);
        
        // Close modal and reset form
        bootstrap.Modal.getInstance(document.getElementById('addStaffModal')).hide();
        document.getElementById('staffForm').reset();
        
        // Reload staff data
        await loadStaffData();
        
        showMessage('Staff member added successfully!', 'success');
        
    } catch (error) {
        showMessage(error.message || 'Failed to add staff member. Please try again.', 'error');
    }
}

// handle add staff
async function handleUpdateStaff() {
    try {
        // Validate form
        if (!validateEditStaffForm()) {
            return;
        }
        
        const staffId = document.getElementById('editStaffId').value;
        const formData = new FormData();
        
        // Create staff data object
        const staffData = {
            staffName: document.getElementById('editStaffName').value.trim(),
            emailAddress: document.getElementById('editStaffEmail').value.trim(),
            contactNumber: document.getElementById('editStaffContact').value.trim(),
            joiningDate: document.getElementById('editJoiningDate').value,
            staffRole: document.getElementById('editStaffRole').value
        };
        
        // Add password only if provided
        const password = document.getElementById('editStaffPassword').value;
        if (password.trim()) {
            staffData.password = password;
        }
        
        // Append staffData as JSON string with the key 'staffData'
        formData.append('staffData', new Blob([JSON.stringify(staffData)], {
            type: 'application/json'
        }));
        
        // Append image file with the key 'staffImage'
        const imageFile = document.getElementById('editStaffImage').files[0];
        if (imageFile) {
            formData.append('staffImage', imageFile);
        }
        
        // Update staff with proper headers
        await updateStaff(staffId, formData);
        
        // Close modal and reset form
        bootstrap.Modal.getInstance(document.getElementById('editStaffModal')).hide();
        document.getElementById('editStaffForm').reset();
        
        // Reload staff data
        await loadStaffData();
        
        showMessage('Staff member updated successfully!', 'success');
        
    } catch (error) {
        showMessage(error.message || 'Failed to update staff member. Please try again.', 'error');
    }
}

// Form validation functions
function validateStaffForm() {
    const requiredFields = [
        { id: 'staffName', message: 'Staff name is required' },
        { id: 'staffEmail', message: 'Email address is required' },
        { id: 'staffPassword', message: 'Password is required' },
        { id: 'staffContact', message: 'Contact number is required' },
        { id: 'joiningDate', message: 'Joining date is required' },
        { id: 'staffRole', message: 'Staff role is required' }
    ];
    
    for (const field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            showMessage(field.message, 'error');
            element.focus();
            return false;
        }
    }
    
    // Validate email format
    const email = document.getElementById('staffEmail').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        document.getElementById('staffEmail').focus();
        return false;
    }
    
    // Validate contact number
    const contact = document.getElementById('staffContact').value.trim();
    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(contact)) {
        showMessage('Please enter a valid 10-digit contact number', 'error');
        document.getElementById('staffContact').focus();
        return false;
    }
    
    return true;
}

function validateEditStaffForm() {
    const requiredFields = [
        { id: 'editStaffName', message: 'Staff name is required' },
        { id: 'editStaffEmail', message: 'Email address is required' },
        { id: 'editStaffContact', message: 'Contact number is required' },
        { id: 'editJoiningDate', message: 'Joining date is required' },
        { id: 'editStaffRole', message: 'Staff role is required' }
    ];
    
    for (const field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            showMessage(field.message, 'error');
            element.focus();
            return false;
        }
    }
    
    // Validate email format
    const email = document.getElementById('editStaffEmail').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        document.getElementById('editStaffEmail').focus();
        return false;
    }
    
    // Validate contact number
    const contact = document.getElementById('editStaffContact').value.trim();
    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(contact)) {
        showMessage('Please enter a valid 10-digit contact number', 'error');
        document.getElementById('editStaffContact').focus();
        return false;
    }
    
    return true;
}

// Image preview functions
function previewImage() {
    const file = document.getElementById('staffImage').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // You can add image preview here if needed
            console.log('Image selected:', file.name);
        };
        reader.readAsDataURL(file);
    }
}

function previewEditImage() {
    const file = document.getElementById('editStaffImage').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // You can add image preview here if needed
            console.log('Image selected:', file.name);
        };
        reader.readAsDataURL(file);
    }
}

// Table rendering functions
function renderStaffTable() {
    const tbody = document.getElementById('staffTableBody');
    
    if (filteredStaffData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center text-muted">
                    <i class="fas fa-users fa-3x mb-3"></i>
                    <p>No staff members found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredStaffData.map(staff => `
        <tr>
            
            <td>${staff.staffId || staff.id || 'N/A'}</td>
            <td>
                ${staff.staffImageUrl ? 
                    `<img src="${staff.staffImageUrl}" alt="Staff Image" class="staff-image" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` : 
                    '<i class="fas fa-user-circle fa-2x text-muted"></i>'
                }
            </td>
            <td>${staff.staffName || 'N/A'}</td>
            <td>${staff.emailAddress || 'N/A'}</td>
            <td>${staff.contactNumber || 'N/A'}</td>
            <td>${staff.joiningDate ? formatDate(staff.joiningDate) : 'N/A'}</td>
            <td>
                <span class="badge bg-primary">${staff.staffRole || 'N/A'}</span>
            </td>
            <td>
                <span class="badge bg-success">Active</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editStaff('${staff.staffId || staff.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteStaffPrompt('${staff.staffId || staff.id}', '${staff.staffName}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Edit staff function
async function editStaff(staffId) {
    try {
        currentEditingStaffId = staffId;
        
        // Get staff data
        const staff = await getStaffById(staffId);
        
        // Populate form fields
        document.getElementById('editStaffId').value = staffId;
        document.getElementById('editStaffName').value = staff.staffName || '';
        document.getElementById('editStaffEmail').value = staff.emailAddress || '';
        document.getElementById('editStaffPassword').value = ''; // Don't populate password
        document.getElementById('editStaffContact').value = staff.contactNumber || '';
        document.getElementById('editJoiningDate').value = staff.joiningDate || '';
        document.getElementById('editStaffRole').value = staff.staffRole || '';
        
        // Show current image if available
        const imagePreview = document.getElementById('currentImagePreview');
        if (staff.staffImageUrl) {
            imagePreview.innerHTML = `
                <img src="${staff.staffImageUrl}" alt="Current Image" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">
                <p class="text-muted mt-2">Current Image</p>
            `;
        } else {
            imagePreview.innerHTML = '<p class="text-muted">No image uploaded</p>';
        }
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editStaffModal'));
        modal.show();
        
    } catch (error) {
        showMessage('Failed to load staff data for editing', 'error');
    }
}

// Delete staff functions
function deleteStaffPrompt(staffId, staffName) {
    currentEditingStaffId = staffId;
    
    document.getElementById('deleteStaffInfo').innerHTML = `
        <strong>Staff Name:</strong> ${staffName}<br>
        <strong>Staff ID:</strong> ${staffId}
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteStaffModal'));
    modal.show();
}

async function confirmDeleteStaff() {
    try {
        if (!currentEditingStaffId) {
            showMessage('No staff member selected for deletion', 'error');
            return;
        }
        
        await deleteStaff(currentEditingStaffId);
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('deleteStaffModal')).hide();
        
        // Reload staff data
        await loadStaffData();
        
        showMessage('Staff member deleted successfully!', 'success');
        
    } catch (error) {
        showMessage(error.message || 'Failed to delete staff member. Please try again.', 'error');
    }
    
    currentEditingStaffId = null;
}

// Filter and search functions
function filterTable() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    
    filteredStaffData = staffData.filter(staff => {
        const matchesSearch = !searchTerm || 
            (staff.staffName && staff.staffName.toLowerCase().includes(searchTerm)) ||
            (staff.emailAddress && staff.emailAddress.toLowerCase().includes(searchTerm)) ||
            (staff.contactNumber && staff.contactNumber.includes(searchTerm));
        
        const matchesRole = !roleFilter || staff.staffRole === roleFilter;
        
        return matchesSearch && matchesRole;
    });
    
    renderStaffTable();
}

function resetTable() {
    document.getElementById('searchInput').value = '';
    document.getElementById('roleFilter').value = '';
    filteredStaffData = [...staffData];
    renderStaffTable();
}

// Select all functionality
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.staff-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Navigation functions (assuming these are needed for the sidebar)
function toggleLeftNav() {
    const leftNav = document.getElementById('leftNavbar');
    const overlay = document.getElementById('overlay');
    
    if (leftNav.classList.contains('open')) {
        leftNav.classList.remove('open');
        overlay.classList.remove('show');
    } else {
        leftNav.classList.add('open');
        overlay.classList.add('show');
    }
}

function toggleDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show');
}

function toggleSubMenu(menuId) {
    const menu = document.getElementById(menuId + 'Menu');
    const arrow = document.getElementById(menuId + 'Arrow');
    
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
        arrow.textContent = '▶';
    } else {
        menu.style.display = 'block';
        arrow.textContent = '▼';
    }
}
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


// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('profileDropdown');
    const profileIcon = document.getElementById('profileIcon');
    
    if (!profileIcon.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Close mobile nav when clicking overlay
document.getElementById('overlay').addEventListener('click', function() {
    toggleLeftNav();
});