document.addEventListener('DOMContentLoaded', function() {
    // Get references to filter elements
    const searchInput = document.getElementById('searchInput');
    const statusSelect = document.getElementById('statusSelect');
    const methodSelect = document.getElementById('methodSelect');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const filterBtn = document.getElementById('filterBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const table = document.getElementById('ordersTable');
    const tbody = table.querySelector('tbody');

    // Store original table state for reset functionality
    const originalTableHTML = tbody.innerHTML;

    // Filter function
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const statusValue = statusSelect.value.toLowerCase();
        const methodValue = methodSelect.value.toLowerCase();
        const startDateValue = startDate.value;
        const endDateValue = endDate.value;

        console.log('Applying filters:', {
            search: searchTerm,
            status: statusValue,
            method: methodValue,
            startDate: startDateValue,
            endDate: endDateValue
        });

        // Get all table rows
        const rows = tbody.querySelectorAll('tr');
        let visibleCount = 0;

        rows.forEach(row => {
            const customerName = row.cells[2].textContent.toLowerCase().trim();
            const productName = row.cells[3].textContent.toLowerCase().trim();
            const method = row.cells[7].textContent.toLowerCase().trim();
            const statusBadge = row.cells[8].querySelector('.badge');
            const status = statusBadge ? statusBadge.textContent.toLowerCase().trim() : '';
            const orderDate = row.cells[10].textContent.trim();

            // Check search filter (customer name or product name)
            const matchesSearch = !searchTerm ||
                customerName.includes(searchTerm) ||
                productName.includes(searchTerm);

            // Check status filter
            const matchesStatus = !statusValue || status.includes(statusValue);

            // Check method filter
            const matchesMethod = !methodValue || method.includes(methodValue);

            // Check date range filter
            const matchesDateRange = (!startDateValue || orderDate >= startDateValue) &&
                (!endDateValue || orderDate <= endDateValue);

            // Show/hide row based on all filters
            const shouldShow = matchesSearch && matchesStatus && matchesMethod && matchesDateRange;

            if (shouldShow) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        console.log(`Showing ${visibleCount} out of ${rows.length} rows`);
    }

    // Reset function
    function resetFilters() {
        // Clear all filter inputs
        searchInput.value = '';
        statusSelect.value = '';
        methodSelect.value = '';
        startDate.value = '';
        endDate.value = '';

        // Show all rows
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            row.style.display = '';
        });

        console.log('Filters reset - showing all rows');
    }

    // Download function
    function downloadFilteredData() {
        const visibleRows = Array.from(tbody.querySelectorAll('tr')).filter(row =>
            row.style.display !== 'none'
        );

        if (visibleRows.length === 0) {
            alert('No data to download!');
            return;
        }

        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";

        // Add headers (excluding checkbox and action columns)
        const headers = [
            "Order ID", "Customer Name", "Product Name", "Quantity", "Price",
            "Total Amount", "Method", "Status", "Estimated Delivery", "Order Date"
        ];
        csvContent += headers.join(",") + "\r\n";

        // Add visible rows data
        visibleRows.forEach(row => {
            const rowData = [
                row.cells[1].textContent.trim(), // Order ID
                row.cells[2].textContent.trim(), // Customer Name
                row.cells[3].textContent.trim(), // Product Name
                row.cells[4].textContent.trim(), // Quantity
                row.cells[5].textContent.trim(), // Price
                row.cells[6].textContent.trim(), // Total Amount
                row.cells[7].textContent.trim(), // Method
                row.cells[8].textContent.trim(), // Status
                row.cells[9].textContent.trim(), // Estimated Delivery
                row.cells[10].textContent.trim() // Order Date
            ];
            csvContent += rowData.map(field => `"${field}"`).join(",") + "\r\n";
        });

        // Create and trigger download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `filtered_orders_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log(`Downloaded ${visibleRows.length} filtered records`);
    }

    // Event listeners for filter functionality
    filterBtn.addEventListener('click', applyFilters);
    resetBtn.addEventListener('click', resetFilters);
    downloadBtn.addEventListener('click', downloadFilteredData);

    // Optional: Apply filters as user types/selects (real-time filtering)
    searchInput.addEventListener('input', applyFilters);
    statusSelect.addEventListener('change', applyFilters);
    methodSelect.addEventListener('change', applyFilters);
    startDate.addEventListener('change', applyFilters);
    endDate.addEventListener('change', applyFilters);

    // Left nav toggle
    document.getElementById('menuIcon').addEventListener('click', function() {
        const leftNav = document.getElementById('leftNav');
        leftNav.style.display = leftNav.style.display === 'none' ? 'block' : 'none';
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
        this.classList.toggle('fa-chevron-down');
        this.classList.toggle('fa-chevron-up');
    });

    document.getElementById('catalogToggle').addEventListener('click', function(e) {
        e.stopPropagation();
        const sub = document.getElementById('catalogSub');
        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
        this.classList.toggle('fa-chevron-down');
        this.classList.toggle('fa-chevron-up');
    });

    document.getElementById('customersToggle').addEventListener('click', function(e) {
        e.stopPropagation();
        const sub = document.getElementById('customersSub');
        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
        this.classList.toggle('fa-chevron-down');
        this.classList.toggle('fa-chevron-up');
    });

    // Select all checkbox functionality
    document.getElementById('selectAll').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // Set up event listeners for edit and delete buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.innerHTML.includes('fa-edit')) {
            btn.onclick = function() {
                enableRowEditing(this.closest('tr'));
            };
        }
    });

    document.querySelectorAll('.btn-danger').forEach(btn => {
        if (btn.innerHTML.includes('fa-trash')) {
            btn.onclick = function() {
                deleteRow(this);
            };
        }
    });

    // Set up invoice buttons
    document.querySelectorAll('.btn-info, .btn-secondary').forEach(btn => {
        if (btn.closest('.action-buttons') && btn.closest('td').cellIndex === 12) {
            btn.onclick = function() {
                showInvoice(this);
            };
        }
    });
});

// Row editing functions
function enableRowEditing(row) {
    const cells = row.cells;
    // Store original values before editing
    row.originalValues = [];
    for (let i = 1; i < cells.length - 2; i++) {
        row.originalValues.push(cells[i].innerHTML);
        // Skip making Order ID (second column) editable
        if (i !== 1) {
            cells[i].contentEditable = true;
            cells[i].style.backgroundColor = '#fff8e1';
        }
    }

    // Change action buttons to Save/Cancel
    const actionCell = cells[cells.length - 2];
    actionCell.innerHTML = `
        <button class="btn btn-sm btn-success" onclick="saveRowChanges(this)"><i class="fas fa-check"></i></button>
        <button class="btn btn-sm btn-danger" onclick="cancelRowEditing(this)"><i class="fas fa-times"></i></button>
    `;
}

function saveRowChanges(btn) {
    const row = btn.closest('tr');
    const cells = row.cells;

    // Disable editing for all cells
    for (let i = 1; i < cells.length - 2; i++) {
        cells[i].contentEditable = false;
        cells[i].style.backgroundColor = '';
    }

    // Update status badge if status was changed
    const statusCell = cells[8];
    const statusText = statusCell.textContent.trim();
    const statusBadge = statusCell.querySelector('.badge');
    if (statusBadge) {
        if (statusText.toLowerCase().includes('pending')) {
            statusBadge.className = 'badge bg-warning';
        } else if (statusText.toLowerCase().includes('delivered')) {
            statusBadge.className = 'badge bg-success';
        } else if (statusText.toLowerCase().includes('shipped')) {
            statusBadge.className = 'badge bg-primary';
        } else if (statusText.toLowerCase().includes('processing')) {
            statusBadge.className = 'badge bg-info';
        } else if (statusText.toLowerCase().includes('completed')) {
            statusBadge.className = 'badge bg-secondary';
        }
    }

    // Restore edit/delete buttons
    const actionCell = cells[cells.length - 2];
    actionCell.innerHTML = `
        <button class="btn btn-sm btn-primary" onclick="enableRowEditing(this.closest('tr'))"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deleteRow(this)"><i class="fas fa-trash"></i></button>
    `;

    // Clear original values
    delete row.originalValues;
}

function cancelRowEditing(btn) {
    const row = btn.closest('tr');
    const cells = row.cells;

    // Restore original values if they exist
    if (row.originalValues) {
        for (let i = 1; i < cells.length - 2; i++) {
            cells[i].innerHTML = row.originalValues[i - 1];
            cells[i].contentEditable = false;
            cells[i].style.backgroundColor = '';
        }
    } else {
        // Just disable editing if no original values
        for (let i = 1; i < cells.length - 2; i++) {
            cells[i].contentEditable = false;
            cells[i].style.backgroundColor = '';
        }
    }

    // Restore edit/delete buttons
    const actionCell = cells[cells.length - 2];
    actionCell.innerHTML = `
        <button class="btn btn-sm btn-primary" onclick="enableRowEditing(this.closest('tr'))"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deleteRow(this)"><i class="fas fa-trash"></i></button>
    `;

    // Clear original values
    delete row.originalValues;
}

function deleteRow(btn) {
    if (confirm('Are you sure you want to delete this order?')) {
        btn.closest('tr').remove();
        console.log('Row deleted');
    }
}

// Function to show invoice when search icon is clicked
function showInvoice(btn) {
    const row = btn.closest('tr');
    const orderId = row.cells[1].textContent;
    const customerName = row.cells[2].textContent;
    const productName = row.cells[3].textContent;
    const quantity = row.cells[4].textContent;
    const price = row.cells[5].textContent;
    const totalAmount = row.cells[6].textContent;
    const method = row.cells[7].textContent;
    const status = row.cells[8].querySelector('.badge').textContent.trim();
    const estimatedDelivery = row.cells[9].textContent;
    const orderDate = row.cells[10].textContent;

    // Generate invoice HTML
    const invoiceHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                <div>
                    <h1 style="font-size: 24px; margin: 0; color: #333;">INVOICE</h1>
                    <p style="margin: 5px 0; color: #666;">ORDER ID: <span style="color: #28a745;">${orderId}</span></p>
                    <p style="margin: 5px 0; color: #666;">STATUS: <span style="color: #28a745;">${status}</span></p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 5px 0; color: #666;">DATE</p>
                    <p style="margin: 5px 0; font-weight: bold;">${orderDate}</p>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                <div>
                    <h3 style="font-size: 16px; margin: 0 0 10px 0; color: #333;">KACHA BAZAR</h3>
                    <p style="margin: 5px 0; color: #666;">59 Station Rd, Prinz Bridge, United Kingdom</p>
                    <p style="margin: 5px 0; color: #666;">018757854</p>
                    <p style="margin: 5px 0; color: #666;">kachakazat@gmail.com</p>
                </div>
                <div style="text-align: right;">
                    <h3 style="font-size: 16px; margin: 0 0 10px 0; color: #333;">INVOICE TO</h3>
                    <p style="margin: 5px 0; font-weight: bold;">${customerName}</p>
                    <p style="margin: 5px 0; color: #666;">customer@gmail.com</p>
                    <p style="margin: 5px 0; color: #666;">1234567890</p>
                    <p style="margin: 5px 0; color: #666;">Industrial Area, Sector 82</p>
                </div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">#</th>
                        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">PRODUCT TITLE</th>
                        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">QUANTITY</th>
                        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">ITEM PRICE</th>
                        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">1</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${productName}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${quantity}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${price}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${totalAmount}</td>
                    </tr>
                </tbody>
            </table>
            
            <div style="display: flex; justify-content: flex-end;">
                <div style="width: 300px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>PAYMENT METHOD</span>
                        <span>${method}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>SHIPPING COST</span>
                        <span>₹20.00</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>DISCOUNT</span>
                        <span>₹0.00</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
                        <span>TOTAL AMOUNT</span>
                        <span>${totalAmount}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                        <span>ESTIMATED DELIVERY</span>
                        <span>${estimatedDelivery}</span>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 50px; text-align: center; color: #666; font-size: 14px;">
                <p>Thank you for your business!</p>
            </div>
        </div>
    `;

    // Insert into modal and show
    document.getElementById('invoiceContent').innerHTML = invoiceHTML;
    const invoiceModal = new bootstrap.Modal(document.getElementById('invoiceModal'));
    invoiceModal.show();
}

// Function to show print preview
function printInvoice() {
    // Close the invoice modal
    const invoiceModal = bootstrap.Modal.getInstance(document.getElementById('invoiceModal'));
    invoiceModal.hide();

    // Create print preview content
    const printPreviewHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="text-align: center; margin-bottom: 30px;">Kunash Media Ltd</h1>
            <div style="text-align: center; margin-bottom: 30px;">
                <p>59 Station Rd, Prinz Bridge, United Kingdom</p>
                <p>018757854 | kachakazat@gmail.com</p>
            </div>
            
            ${document.getElementById('invoiceContent').innerHTML}
            
            <div style="margin-top: 50px; text-align: center;">
                <p>Thank you for your order. Come Again...!</p>
            </div>
            
            <div style="margin-top: 50px; font-size: 12px; color: #666;">
                <p>Date: ${new Date().toLocaleDateString()}</p>
                <p>VAT number: £7589</p>
            </div>
        </div>
    `;

    // Insert into print preview modal and show
    document.getElementById('printPreviewContent').innerHTML = printPreviewHTML;
    const printPreviewModal = new bootstrap.Modal(document.getElementById('printPreviewModal'));
    printPreviewModal.show();
}