// API Base URL - Update this according to your backend server
const API_BASE_URL = 'http://localhost:8080/api/admin';

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

// Fix for export functionality
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

// Fix for loading spinner
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    const table = document.querySelector('.table-responsive');

    if (spinner && table) {
        if (show) {
            spinner.style.display = 'block';
            table.style.display = 'none';
        } else {
            spinner.style.display = 'none';
            table.style.display = 'block';
        }
    }
}

// Store original table data
let originalTableData = [];

// Function to initialize original table data
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
        const response = await fetch(`${API_BASE_URL}/get-all-admins`);
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
    const name = document.getElementById('adminName').value.trim();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value.trim();

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        // Check if admin exists by email
        const existsResponse = await fetch(`${API_BASE_URL}/exists/${encodeURIComponent(email)}`);
        const exists = await existsResponse.json();

        if (exists) {
            alert('Admin with this email already exists');
            return;
        }

        const adminData = {
            name: name,
            email: email,
            password: password
        };

        const response = await fetch(`${API_BASE_URL}/create-admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminData)
        });

        if (response.ok) {
            const newAdmin = await response.json();
            alert('Admin added successfully!');

            // Close modal and reset form
            document.getElementById('addAdminForm').reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addAdminModal'));
            modal.hide();

            // Reload data
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

// Admin table edit/delete functionality
function enableRowEditing(row) {
    const cells = row.cells;
    const adminId = cells[0].textContent; // Get admin ID

    // Make name and email editable (skip ID, password, dates, and actions)
    cells[1].contentEditable = true; // name
    cells[2].contentEditable = true; // email

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
        const response = await fetch(`${API_BASE_URL}/${adminId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            // Reset editing state
            cells[1].contentEditable = false;
            cells[2].contentEditable = false;
            cells[1].style.backgroundColor = '';
            cells[2].style.backgroundColor = '';

            // Restore original buttons
            const actionCell = cells[cells.length - 1];
            actionCell.innerHTML = `
                    <button class="btn btn-sm btn-warning"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                `;

            alert('Admin updated successfully!');
            loadAdminData(); // Reload to get updated timestamps
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

    cells[1].contentEditable = false;
    cells[2].contentEditable = false;
    cells[1].style.backgroundColor = '';
    cells[2].style.backgroundColor = '';

    // Restore original buttons
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
            const response = await fetch(`${API_BASE_URL}/${adminId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Admin deleted successfully!');
                loadAdminData(); // Reload data
            } else {
                alert('Failed to delete admin');
            }
        } catch (error) {
            console.error('Error deleting admin:', error);
            alert('Error connecting to server');
        }
    }
}

// Function to filter table
function filterTable() {
    const searchInput = document.querySelector('.form-control');
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

// Function to reset table
function resetTable() {
    const table = document.querySelector('table');
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach((row, index) => {
        row.style.display = '';
        if (originalTableData[index]) {
            row.innerHTML = originalTableData[index];
        }
    });

    document.querySelector('.form-control').value = '';
}

// Export functionality
function exportToExcel() {
    try {
        // Check if XLSX library is loaded
        if (typeof XLSX === 'undefined') {
            alert('XLSX library not loaded. Please check your internet connection and try again.');
            return;
        }

        // Get the table element
        const table = document.querySelector('.table-responsive table');
        if (!table) {
            alert('Table not found');
            return;
        }

        // Create a workbook with the table data
        const workbook = XLSX.utils.table_to_book(table, { sheet: "Admin Details" });

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, 'admin_details_export.xlsx');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        alert('Error exporting to Excel. Please try again.');
    }
}

function exportToCSV() {
    try {
        // Check if XLSX library is loaded
        if (typeof XLSX === 'undefined') {
            alert('XLSX library not loaded. Please check your internet connection and try again.');
            return;
        }

        // Get the table element
        const table = document.querySelector('.table-responsive table');
        if (!table) {
            alert('Table not found');
            return;
        }

        // Convert table to worksheet
        const worksheet = XLSX.utils.table_to_sheet(table);

        // Convert worksheet to CSV
        const csv = XLSX.utils.sheet_to_csv(worksheet);

        // Create download link
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

document.addEventListener('DOMContentLoaded', function() {
    // Initialize submenu toggles
    setupSubmenuToggle('catalogToggle', 'catalogSub');
    setupSubmenuToggle('customersToggle', 'customersSub');
    setupSubmenuToggle('onlineStoreToggle', 'onlineStoreSub');
    setupSubmenuToggle('storeCustomizationToggle', 'storeCustomizationSub');
    setupSubmenuToggle('settingsToggle', 'settingsSub');

    // Setup export buttons
    setupExportButtons();

    // Load admin data
    loadAdminData();

    // Left nav toggle - Updated version
    const menuIcon = document.getElementById('menuIcon');
    if (menuIcon) {
        menuIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            const leftNav = document.getElementById('leftNav');
            if (leftNav.style.display === 'none' || !leftNav.style.display) {
                leftNav.style.display = 'block';
            } else {
                leftNav.style.display = 'none';
            }
        });
    }

    // Close left nav when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#leftNav') && !e.target.closest('#menuIcon')) {
            const leftNav = document.getElementById('leftNav');
            if (leftNav) {
                leftNav.style.display = 'none';
            }
        }
    });

    // Profile menu toggle
    const profileIcon = document.getElementById('profileIcon');
    if (profileIcon) {
        profileIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            const menu = document.getElementById('profileMenu');
            if (menu) {
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            }
        });
    }

    // Close profile menu when clicking outside
    document.addEventListener('click', function() {
        const profileMenu = document.getElementById('profileMenu');
        if (profileMenu) {
            profileMenu.style.display = 'none';
        }
    });

    // Event delegation for table buttons
    document.addEventListener('click', function(e) {
        // Edit button
        if (e.target.closest('.btn-warning') && !e.target.closest('.btn-success')) {
            const row = e.target.closest('tr');
            enableRowEditing(row);
        }

        // Delete button
        if (e.target.closest('.btn-danger')) {
            deleteRow(e.target.closest('.btn-danger'));
        }

        // Save button
        if (e.target.closest('.btn-success')) {
            saveRowChanges(e.target.closest('.btn-success'));
        }

        // Cancel button
        if (e.target.closest('.btn-secondary')) {
            cancelRowEditing(e.target.closest('.btn-secondary'));
        }
    });

    // Add event listeners for filter and reset buttons
    const filterBtn = document.getElementById('filterBtn');
    const resetBtn = document.getElementById('resetBtn');

    if (filterBtn) {
        filterBtn.addEventListener('click', filterTable);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetTable);
    }

    // Also allow filtering by pressing Enter in search box
    const searchInput = document.querySelector('.form-control');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterTable();
            }
        });
    }
});