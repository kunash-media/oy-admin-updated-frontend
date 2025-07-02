    // API Base URL - Update this according to your backend server
    const API_BASE_URL = 'http://localhost:8080/api/admin';

    document.addEventListener('DOMContentLoaded', function() {

        // Add these new event listeners for the new menu items
        const storeCustomizationToggle = document.getElementById('storeCustomizationToggle');
        const storeCustomizationSub = document.getElementById('storeCustomizationSub');

        if (storeCustomizationToggle && storeCustomizationSub) {
            storeCustomizationToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                storeCustomizationSub.style.display = storeCustomizationSub.style.display === 'block' ? 'none' : 'block';
                this.classList.toggle('fa-chevron-up');
                this.classList.toggle('fa-chevron-down');
            });
        }

        const settingsToggle = document.getElementById('settingsToggle');
        const settingsSub = document.getElementById('settingsSub');

        if (settingsToggle && settingsSub) {
            settingsToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                settingsSub.style.display = settingsSub.style.display === 'block' ? 'none' : 'block';
                this.classList.toggle('fa-chevron-up');
                this.classList.toggle('fa-chevron-down');
            });
        }
        // Load admin data when page loads
        loadAdminData();
        // Left nav toggle
        document.getElementById('menuIcon').addEventListener('click', function(e) {
            e.stopPropagation();
            const leftNav = document.getElementById('leftNav');
            leftNav.style.display = leftNav.style.display === 'block' ? 'none' : 'block';
        });

        // Close left nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#leftNav') && !e.target.closest('#menuIcon')) {
                document.getElementById('leftNav').style.display = 'none';
            }
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
        document.getElementById('onlineStoreToggle').addEventListener('click', function(e) {
            e.stopPropagation();
            const sub = document.getElementById('onlineStoreSub');
            sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
        });

        document.getElementById('catalogToggle').addEventListener('click', function(e) {
            e.stopPropagation();
            const sub = document.getElementById('catalogSub');
            sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
        });

        document.getElementById('customersToggle').addEventListener('click', function(e) {
            e.stopPropagation();
            const sub = document.getElementById('customersSub');
            sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
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
    });

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

    function showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        const table = document.querySelector('.table-responsive');

        if (show) {
            spinner.style.display = 'block';
            table.style.display = 'none';
        } else {
            spinner.style.display = 'none';
            table.style.display = 'block';
        }
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

    // Update event delegation to pass admin ID for edit operations
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

        // Note: Save and Cancel buttons are handled by their onclick attributes
    });



    // Store original table data
    let originalTableData = [];

    // Function to initialize original table data
    function initOriginalTableData() {
        const table = document.querySelector('table');
        const rows = table.querySelectorAll('tbody tr');
        originalTableData = Array.from(rows).map(row => row.innerHTML);
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

    // Initialize original table data when page loads
    document.addEventListener('DOMContentLoaded', function() {
        initOriginalTableData();

        // Add event listeners for filter and reset buttons
        document.getElementById('filterBtn').addEventListener('click', filterTable);
        document.getElementById('resetBtn').addEventListener('click', resetTable);

        // Also allow filtering by pressing Enter in search box
        document.querySelector('.form-control').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterTable();
            }
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
    });

    function exportToExcel() {
        try {
            // Get the table element
            const table = document.querySelector('.table-responsive table');

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
            // Get the table element
            const table = document.querySelector('.table-responsive table');

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