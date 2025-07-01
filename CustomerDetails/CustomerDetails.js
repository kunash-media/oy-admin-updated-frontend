// Backend API configuration
const API_BASE_URL = 'http://localhost:8080/api/users';

// Function to fetch all users from backend
async function fetchCustomers() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const tableBody = document.getElementById('customerTableBody');

    try {
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';

        // Fetch data from backend
        const response = await fetch(`${API_BASE_URL}/getAllUsers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const customers = await response.json();

        // Clear existing table data
        tableBody.innerHTML = '';

        // Populate table with customer data
        customers.forEach((customer, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${customer.id || index + 1}</td>
                    <td>${customer.anniversaryDate || 'N/A'}</td>
                    <td>${customer.birthdate || 'N/A'}</td>
                    <td>${customer.customerName || customer.name || 'N/A'}</td>
                    <td>${customer.maritalStatus || 'N/A'}</td>
                    <td>${customer.mobile || 'N/A'}</td>
                    <td>${customer.password ? '••••••••' : 'N/A'}</td>
                    <td><span class="badge ${customer.status==='active' ? 'bg-success' : 'bg-secondary'} ">${customer.status || 'Active'}</span></td>
                    <td>
                        <button class="btn btn-sm btn-warning me-1 "><i class="fas fa-edit "></i></button>
                        <button class="btn btn-sm btn-danger "><i class="fas fa-trash "></i></button>
                    </td>
                `;
            tableBody.appendChild(row);
        });

        // Initialize original table data for filtering
        initOriginalTableData();

    } catch (error) {
        console.error('Error fetching customers:', error);
        errorMessage.textContent = `Error loading customer data: ${error.message}`;
        errorMessage.style.display = 'block';
    } finally {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Load customer data on page load
    fetchCustomers();


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

// Customer table edit/delete functionality
function enableRowEditing(row) {
    const cells = row.cells;
    for (let i = 1; i < cells.length - 1; i++) { // Skip ID and Actions columns
        const cell = cells[i];
        const originalValue = cell.textContent;
        cell.contentEditable = true;
        cell.style.backgroundColor = '#fff8e1';
    }

    // Change buttons to Save/Cancel
    const actionCell = cells[cells.length - 1];
    actionCell.innerHTML = `
            <button class="btn btn-sm btn-success me-1 "><i class="fas fa-check "></i></button>
            <button class="btn btn-sm btn-secondary "><i class="fas fa-times "></i></button>
        `;
}

function saveRowChanges(btn) {
    const row = btn.closest('tr');
    const cells = row.cells;
    for (let i = 1; i < cells.length - 1; i++) {
        const cell = cells[i];
        cell.contentEditable = false;
        cell.style.backgroundColor = '';

        // Update status badge color if status cell was edited
        if (i === 7) { // Status is in column 7 (0-based index)
            const statusBadge = cell.querySelector('.badge');
            if (statusBadge) {
                if (cell.textContent.toLowerCase().includes('active')) {
                    statusBadge.className = 'badge bg-success';
                } else if (cell.textContent.toLowerCase().includes('inactive')) {
                    statusBadge.className = 'badge bg-secondary';
                }
            }
        }
    }

    // Restore original buttons
    const actionCell = cells[cells.length - 1];
    actionCell.innerHTML = `
            <button class="btn btn-sm btn-warning "><i class="fas fa-edit "></i></button>
            <button class="btn btn-sm btn-danger "><i class="fas fa-trash "></i></button>
        `;

    console.log('Row changes saved');
}

function cancelRowEditing(btn) {
    const row = btn.closest('tr');
    const cells = row.cells;
    for (let i = 1; i < cells.length - 1; i++) {
        const cell = cells[i];
        cell.contentEditable = false;
        cell.style.backgroundColor = '';
    }

    // Restore original buttons
    const actionCell = cells[cells.length - 1];
    actionCell.innerHTML = `
            <button class="btn btn-sm btn-warning "><i class="fas fa-edit "></i></button>
            <button class="btn btn-sm btn-danger "><i class="fas fa-trash "></i></button>
        `;
}

function deleteRow(btn) {
    if (confirm('Are you sure you want to delete this customer?')) {
        btn.closest('tr').remove();
        console.log('Row deleted');
    }
}

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
        const name = cells[3].textContent.toLowerCase(); // Customer Name column
        const mobile = cells[5].textContent.toLowerCase(); // Mobile column

        if (name.includes(searchTerm) || mobile.includes(searchTerm)) {
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

// Initialize filter and reset functionality
document.addEventListener('DOMContentLoaded', function() {
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
        const workbook = XLSX.utils.table_to_book(table, {
            sheet: "Customer Details "
        });

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, 'customer_details_export.xlsx');
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
        const blob = new Blob([csv], {
            type: 'text/csv;charset=utf-8;'
        });
        const link = document.createElement("a ");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href ", url);
        link.setAttribute("download ", "customer_details_export.csv ");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error exporting to CSV:', error);
        alert('Error exporting to CSV. Please try again.');
    }
}