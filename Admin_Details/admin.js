 // API Base URL - Update this according to your backend server
        const BASE_URL = 'http://localhost:8080/api/admin';

        // Store original table data
        let originalTableData = [];

        // Initialize submenu toggles
        function setupSubmenuToggle(toggleId, submenuId) {
            const toggle = document.getElementById(toggleId);
            const submenu = document.getElementById(submenuId);

            if (toggle && submenu) {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const isVisible = submenu.style.display === 'block';
                    submenu.style.display = isVisible ? 'none' : 'block';
                    this.classList.toggle('fa-chevron-up');
                    this.classList.toggle('fa-chevron-down');
                });
            }
        }

        // Setup export buttons
        function setupExportButtons() {
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
        }

        // Loading spinner control
        function showLoading(show) {
            const spinner = document.getElementById('loadingSpinner');
            const table = document.querySelector('.table-responsive');

            if (spinner && table) {
                spinner.style.display = show ? 'block' : 'none';
                table.style.display = show ? 'none' : 'block';
            }
        }

        // Initialize original table data for reset functionality
        function initOriginalTableData() {
            const table = document.querySelector('table');
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                originalTableData = Array.from(rows).map(row => row.innerHTML);
            }
        }

        // Database connectivity functions
        async function loadAdminData() {
            showLoading(true);
            try {

                const response = await fetch(`${BASE_URL}/get-all-admins`);

                if (response.ok) {
                    const admins = await response.json();
                    populateAdminTable(admins);
                    initOriginalTableData();
                } else {
                    console.error('Failed to fetch admins:', response.statusText);
                    showError('Failed to load admin data');
                }
            } catch (error) {
                console.error('Error fetching admins:', error);
                showError('Error connecting to server');
            } finally {
                showLoading(false);
            }
        }

        function populateAdminTable(admins) {
            const tableBody = document.getElementById('adminTableBody');
            if (!tableBody) {
                console.error('Table body element not found');
                return;
            }

            tableBody.innerHTML = '';

            admins.forEach(admin => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${admin.id}</td>
                    <td>${admin.name}</td>
                    <td>${admin.email}</td>
                    <td>••••••••</td>
                    <td>${formatDate(admin.createdAt)}</td>
                    <td>${formatDate(admin.updatedAt)}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

        function formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }

        function showError(message) {
            alert(message);
        }

        async function addNewAdmin() {
            const nameInput = document.getElementById('adminName');
            const emailInput = document.getElementById('adminEmail');
            const passwordInput = document.getElementById('adminPassword');

            if (!nameInput || !emailInput || !passwordInput) {
                alert('Form fields not found');
                return;
            }

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!name || !email || !password) {
                alert('Please fill in all fields');
                return;
            }

            try {
                // Check if admin exists by email
                const existsResponse = await fetch(`${BASE_URL}/exists/${encodeURIComponent(email)}`);
                const exists = await existsResponse.json();

                if (exists) {
                    alert('Admin with this email already exists');
                    return;
                }

                const adminData = { name, email, password };

                const response = await fetch(`${BASE_URL}/create-admin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(adminData)
                });

                if (response.ok) {
                    alert('Admin added successfully!');
                    document.getElementById('addAdminForm').reset();
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addAdminModal'));
                    if (modal) {
                        modal.hide();
                    }
                    loadAdminData();
                } else {
                    const error = await response.text();
                    alert('Failed to add admin: ' + error);
                }
            } catch (error) {
                console.error('Error adding admin:', error);
                alert('Error connecting to server');
            }
        }

        // Admin table edit functionality
        function enableRowEditing(row) {
            const cells = row.cells;
            const adminId = cells[0].textContent;

            // Make name and email editable
            cells[1].contentEditable = true;
            cells[2].contentEditable = true;
            cells[1].style.backgroundColor = '#fff8e1';
            cells[2].style.backgroundColor = '#fff8e1';

            // Change buttons to Save/Cancel
            const actionCell = cells[cells.length - 1];
            actionCell.innerHTML = `
                <button class="btn btn-sm btn-success me-1" onclick="saveRowChanges(this, ${adminId})"><i class="fas fa-check"></i></button>
                <button class="btn btn-sm btn-secondary" onclick="cancelRowEditing(this)"><i class="fas fa-times"></i></button>
            `;
        }

        async function saveRowChanges(btn, adminId) {
            const row = btn.closest('tr');
            const cells = row.cells;

            const updatedData = {
                name: cells[1].textContent.trim(),
                email: cells[2].textContent.trim()
            };

            try {
                const response = await fetch(`${BASE_URL}/${adminId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedData)
                });

                if (response.ok) {
                    resetEditingState(cells);
                    alert('Admin updated successfully!');
                    loadAdminData();
                } else {
                    alert('Failed to update admin');
                    cancelRowEditing(btn);
                }
            } catch (error) {
                console.error('Error updating admin:', error);
                alert('Error connecting to server');
                cancelRowEditing(btn);
            }
        }

        function cancelRowEditing(btn) {
            const row = btn.closest('tr');
            const cells = row.cells;
            resetEditingState(cells);
        }

        function resetEditingState(cells) {
            cells[1].contentEditable = false;
            cells[2].contentEditable = false;
            cells[1].style.backgroundColor = '';
            cells[2].style.backgroundColor = '';

            const actionCell = cells[cells.length - 1];
            actionCell.innerHTML = `
                <button class="btn btn-sm btn-warning"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
            `;
        }

        async function deleteRow(btn) {
            if (confirm('Are you sure you want to delete this admin?')) {
                const row = btn.closest('tr');
                const adminId = row.cells[0].textContent;

                try {
                    const response = await fetch(`${BASE_URL}/${adminId}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        alert('Admin deleted successfully!');
                        loadAdminData();
                    } else {
                        alert('Failed to delete admin');
                    }
                } catch (error) {
                    console.error('Error deleting admin:', error);
                    alert('Error connecting to server');
                }
            }
        }

        // Filter table functionality
        function filterTable() {
            const searchInput = document.querySelector('.form-control');
            if (!searchInput) {
                alert('Search input not found');
                return;
            }

            const searchTerm = searchInput.value.trim().toLowerCase();

            if (!searchTerm) {
                alert('Please enter a search term');
                return;
            }

            const table = document.querySelector('table');
            const rows = table.querySelectorAll('tbody tr');
            let hasMatches = false;

            rows.forEach(row => {
                const cells = row.cells;
                const id = cells[0].textContent.toLowerCase();
                const name = cells[1].textContent.toLowerCase();
                const email = cells[2].textContent.toLowerCase();

                if (id.includes(searchTerm) || name.includes(searchTerm) || email.includes(searchTerm)) {
                    row.style.display = '';
                    hasMatches = true;
                } else {
                    row.style.display = 'none';
                }
            });

            if (!hasMatches) {
                alert('No matching records found');
            }
        }

        // Reset table to original state
        function resetTable() {
            const table = document.querySelector('table');
            const rows = table.querySelectorAll('tbody tr');
            const searchInput = document.querySelector('.form-control');

            rows.forEach((row, index) => {
                row.style.display = '';
                if (originalTableData[index]) {
                    row.innerHTML = originalTableData[index];
                }
            });

            if (searchInput) {
                searchInput.value = '';
            }
        }

        // Export to Excel
        function exportToExcel() {
            try {
                if (typeof XLSX === 'undefined') {
                    alert('XLSX library not loaded. Please check your internet connection and try again.');
                    return;
                }

                const table = document.querySelector('.table-responsive table');
                if (!table) {
                    alert('Table not found');
                    return;
                }

                const workbook = XLSX.utils.table_to_book(table, { sheet: "Admin Details" });
                XLSX.writeFile(workbook, 'admin_details_export.xlsx');
            } catch (error) {
                console.error('Error exporting to Excel:', error);
                alert('Error exporting to Excel. Please try again.');
            }
        }

        // Export to CSV
        function exportToCSV() {
            try {
                if (typeof XLSX === 'undefined') {
                    alert('XLSX library not loaded. Please check your internet connection and try again.');
                    return;
                }

                const table = document.querySelector('.table-responsive table');
                if (!table) {
                    alert('Table not found');
                    return;
                }

                const worksheet = XLSX.utils.table_to_sheet(table);
                const csv = XLSX.utils.sheet_to_csv(worksheet);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                
                link.setAttribute("href", url);
                link.setAttribute("download", "admin_details_export.csv");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Error exporting to CSV:', error);
                alert('Error exporting to CSV. Please try again.');
            }
        }

        // // DOM Content Loaded Event
        document.addEventListener('DOMContentLoaded', function() {
       

            // Close profile menu when clicking outside
            document.addEventListener('click', function() {
                const profileMenu = document.getElementById('profileMenu');
                if (profileMenu) profileMenu.style.display = 'none';
            });

            // Event delegation for table buttons
            document.addEventListener('click', function(e) {
                if (e.target.closest('.btn-warning') && !e.target.closest('.btn-success')) {
                    const row = e.target.closest('tr');
                    if (row) enableRowEditing(row);
                }

                if (e.target.closest('.btn-danger')) {
                    deleteRow(e.target.closest('.btn-danger'));
                }
            });

            // Filter and reset button event listeners
            const filterBtn = document.getElementById('filterBtn');
            const resetBtn = document.getElementById('resetBtn');
            const searchInput = document.querySelector('.form-control');

            if (filterBtn) filterBtn.addEventListener('click', filterTable);
            if (resetBtn) resetBtn.addEventListener('click', resetTable);
            if (searchInput) {
                searchInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') filterTable();
                });
            }
        });

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