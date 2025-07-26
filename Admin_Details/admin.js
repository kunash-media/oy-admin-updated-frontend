// Global variables
        let admins = [];
        let filteredAdmins = [];
        let currentAdminId = null;
        let isEditMode = false;
        let searchTimeout = null;
        let confirmCallback = null;

        // API base URL
        const API_BASE_URL = 'http://localhost:8080/api/admin';

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            loadAdmins();
            setupEventListeners();
        });

        // Setup event listeners
        function setupEventListeners() {
            // Search input with 3-letter delay
            document.getElementById('searchInput').addEventListener('input', function(e) {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    filterAdmins();
                }, 300);
            });

            // Role filter
            document.getElementById('roleFilter').addEventListener('change', filterAdmins);

            // Form submission
            document.getElementById('adminForm').addEventListener('submit', handleFormSubmit);

            // Close overlays when clicking outside
            document.getElementById('adminFormOverlay').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeAdminForm();
                }
            });

            document.getElementById('confirmModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeConfirmModal();
                }
            });
        }

       
        // API functions
        async function loadAdmins() {
            try {
                showLoading(true);
                const response = await fetch(`${API_BASE_URL}/get-all-admins`);
                if (response.ok) {
                    admins = await response.json();
                    filteredAdmins = [...admins];
                    renderAdmins();
                } else {
                    throw new Error('Failed to load admins');
                }
            } catch (error) {
                console.error('Error loading admins:', error);
                alert('Error loading admins. Please try again.');
            } finally {
                showLoading(false);
            }
        }

        async function createAdmin(adminData) {
            try {
                const response = await fetch(`${API_BASE_URL}/create-admin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(adminData)
                });

                if (response.ok) {
                    const newAdmin = await response.json();
                    admins.push(newAdmin);
                    filterAdmins();
                    closeAdminForm();
                    alert('Admin created successfully!');
                } else {
                    throw new Error('Failed to create admin');
                }
            } catch (error) {
                console.error('Error creating admin:', error);
                alert('Error creating admin. Please try again.');
            }
        }

        async function updateAdmin(id, adminData) {
            try {
                const response = await fetch(`${API_BASE_URL}/update-admin/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(adminData)
                });

                if (response.ok) {
                    const updatedAdmin = await response.json();
                    const index = admins.findIndex(admin => admin.id === id);
                    if (index !== -1) {
                        admins[index] = updatedAdmin;
                    }
                    filterAdmins();
                    closeAdminForm();
                    alert('Admin updated successfully!');
                } else {
                    throw new Error('Failed to update admin');
                }
            } catch (error) {
                console.error('Error updating admin:', error);
                alert('Error updating admin. Please try again.');
            }
        }

        async function deleteAdmin(id) {
            try {
                const response = await fetch(`${API_BASE_URL}/delete-admin/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    admins = admins.filter(admin => admin.id !== id);
                    filterAdmins();
                    alert('Admin deleted successfully!');
                } else {
                    throw new Error('Failed to delete admin');
                }
            } catch (error) {
                console.error('Error deleting admin:', error);
                alert('Error deleting admin. Please try again.');
            }
        }

        // UI functions
        function showLoading(show) {
            const loading = document.getElementById('loading');
            const tableSection = document.querySelector('.table-section');
            
            if (show) {
                loading.style.display = 'block';
                tableSection.style.display = 'none';
            } else {
                loading.style.display = 'none';
                tableSection.style.display = 'block';
            }
        }

        function renderAdmins() {
            const tbody = document.getElementById('adminTableBody');
            tbody.innerHTML = '';

            if (filteredAdmins.length === 0) {
                // Continuation of renderAdmins() function
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No admins found</td></tr>';
                return;
            }

            filteredAdmins.forEach(admin => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${admin.id}</td>
                    <td>${admin.name}</td>
                    <td>${admin.email}</td>
                    <td>${admin.mobileNumber}</td>
                    <td><span class="role-badge">${admin.role}</span></td>
                    <td>${formatDate(admin.createdAt)}</td>
                    <td>${formatDate(admin.updatedAt)}</td>
                    <td class="actions-cell">
                        <button class="btn btn-sm btn-warning" onclick="editAdmin(${admin.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="confirmDelete(${admin.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        function filterAdmins() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const roleFilter = document.getElementById('roleFilter').value;

            filteredAdmins = admins.filter(admin => {
                const matchesSearch = admin.name.toLowerCase().includes(searchTerm) ||
                                    admin.email.toLowerCase().includes(searchTerm);
                const matchesRole = !roleFilter || admin.role === roleFilter;
                return matchesSearch && matchesRole;
            });

            renderAdmins();
        }

        function formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Form functions
        function openAddAdminForm() {
            isEditMode = false;
            currentAdminId = null;
            document.getElementById('formTitle').textContent = 'Add Admin';
            document.getElementById('submitBtn').textContent = 'Add Admin';
            document.getElementById('adminForm').reset();
            document.getElementById('adminFormOverlay').style.display = 'flex';
        }

        function editAdmin(id) {
            const admin = admins.find(a => a.id === id);
            if (!admin) return;

            isEditMode = true;
            currentAdminId = id;
            document.getElementById('formTitle').textContent = 'Edit Admin';
            document.getElementById('submitBtn').textContent = 'Update Admin';
            
            document.getElementById('adminName').value = admin.name;
            document.getElementById('adminEmail').value = admin.email;
            document.getElementById('adminMobile').value = admin.mobileNumber;
            document.getElementById('adminRole').value = admin.role;
            document.getElementById('adminPassword').value = '';
            document.getElementById('adminPassword').placeholder = 'Leave empty to keep current password';
            
            document.getElementById('adminFormOverlay').style.display = 'flex';
        }

        function closeAdminForm() {
            document.getElementById('adminFormOverlay').style.display = 'none';
            document.getElementById('adminForm').reset();
            document.getElementById('adminPassword').placeholder = '';
            isEditMode = false;
            currentAdminId = null;
        }

        function handleFormSubmit(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('adminName').value,
                email: document.getElementById('adminEmail').value,
                mobileNumber : document.getElementById('adminMobile').value,
                role: document.getElementById('adminRole').value
            };

            const password = document.getElementById('adminPassword').value;
            if (password || !isEditMode) {
                formData.password = password;
            }

            if (isEditMode) {
                updateAdmin(currentAdminId, formData);
            } else {
                createAdmin(formData);
            }
        }

        // Confirmation modal functions
        function confirmDelete(id) {
            const admin = admins.find(a => a.id === id);
            if (!admin) return;

            document.getElementById('confirmMessage').textContent = 
                `Are you sure you want to delete admin "${admin.name}"? This action cannot be undone.`;
            document.getElementById('confirmModal').style.display = 'flex';
            
            confirmCallback = () => {
                deleteAdmin(id);
                closeConfirmModal();
            };
        }

        function closeConfirmModal() {
            document.getElementById('confirmModal').style.display = 'none';
            confirmCallback = null;
        }

        function confirmAction() {
            if (confirmCallback) {
                confirmCallback();
            }
        }

        // Export function
        function exportToExcel() {
            if (filteredAdmins.length === 0) {
                alert('No data to export');
                return;
            }

            const headers = ['ID', 'Name', 'Email', 'Role', 'Created At', 'Updated At'];
            const csvContent = [
                headers.join(','),
                ...filteredAdmins.map(admin => [
                    admin.id,
                    `"${admin.name}"`,
                    `"${admin.email}"`,
                    admin.role,
                    `"${formatDate(admin.createdAt)}"`,
                    `"${formatDate(admin.updatedAt)}"`
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `admins_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }

        // Handle window resize
        window.addEventListener('resize', function() {
            const leftNav = document.getElementById('leftNavbar');
            const mainContent = document.getElementById('mainContent');
            const overlay = document.getElementById('overlay');
            
            if (window.innerWidth > 768) {
                if (leftNav.classList.contains('active')) {
                    mainContent.classList.add('shifted');
                }
                overlay.style.display = 'none';
            } else {
                mainContent.classList.remove('shifted');
                if (leftNav.classList.contains('active')) {
                    overlay.style.display = 'block';
                }
            }
        });


//----------------- Navigation functions -------------------//

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation state based on screen size
    const leftNav = document.getElementById('leftNavbar');
    const mainContent = document.querySelector('.main-content'); // Changed from getElementById
    
    // Set initial state based on screen width
    if (window.innerWidth > 768) {
        leftNav?.classList.add('open');
        mainContent?.classList.add('shifted');
    }

    // Initialize dropdown menus
    document.querySelectorAll('.nav-link[onclick^="toggleSubMenu"]').forEach(link => {
        const menuId = link.getAttribute('onclick').match(/'([^']+)'/)[1];
        const menu = document.getElementById(menuId + 'Menu');
        if (window.location.href.includes(menuId.toLowerCase())) {
            menu?.classList.add('show');
            document.getElementById(menuId + 'Arrow')?.classList.add('rotated');
        }
    });
});

function toggleLeftNav() {
    const leftNav = document.getElementById('leftNavbar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.getElementById('overlay');
    
    if (!leftNav || !mainContent || !overlay) {
        console.error('Navigation elements not found');
        return;
    }

    // Toggle navigation and overlay
    leftNav.classList.toggle('open');
    overlay.style.display = leftNav.classList.contains('open') ? 'block' : 'none';
    
    // Only shift content on desktop
    if (window.innerWidth > 768) {
        mainContent.classList.toggle('shifted');
    }
    
    // Close any open dropdown menus when toggling nav
    if (!leftNav.classList.contains('open')) {
        document.getElementById('profileDropdown')?.classList.remove('show');
    }
}

function toggleDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function toggleSubMenu(menuId) {
    const menu = document.getElementById(menuId + 'Menu');
    const arrow = document.getElementById(menuId + 'Arrow');
    
    if (menu && arrow) {
        menu.classList.toggle('show');
        arrow.classList.toggle('rotated');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('profileDropdown');
    const profileIcon = document.querySelector('.profile-icon');
    
    if (dropdown && profileIcon && !profileIcon.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Close left nav when clicking overlay
document.getElementById('overlay')?.addEventListener('click', function() {
    const leftNav = document.getElementById('leftNavbar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.getElementById('overlay');
    
    leftNav?.classList.remove('open');
    mainContent?.classList.remove('shifted');
    overlay.style.display = 'none';
});

// Close left navigation when clicking outside on mobile
document.addEventListener('click', function(event) {
    const leftNav = document.getElementById('leftNavbar');
    const menuIcon = document.querySelector('.menu-icon');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.getElementById('overlay');
    
    if (window.innerWidth <= 768 && leftNav?.classList.contains('open') &&
        !leftNav.contains(event.target) && !menuIcon?.contains(event.target)) {
        leftNav.classList.remove('open');
        mainContent?.classList.remove('shifted');
        overlay.style.display = 'none';
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    const leftNav = document.getElementById('leftNavbar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.getElementById('overlay');
    
    if (window.innerWidth > 768) {
        // On desktop, ensure nav is open
        leftNav?.classList.add('open');
        mainContent?.classList.add('shifted');
        overlay.style.display = 'none';
    } else {
        // On mobile, reset to closed state
        leftNav?.classList.remove('open');
        mainContent?.classList.remove('shifted');
        overlay.style.display = 'none';
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
        
    
        sessionStorage.clear();
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = '../Login/Login.html';
        }, 1500);
    });
}