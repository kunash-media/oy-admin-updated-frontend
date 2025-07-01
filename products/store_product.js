// Add these variables at the top of your script with other variables
const commonSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
let selectedSizes = [];

// Add this function to initialize the size selection
function initializeSizeSelection() {
    const sizeGrid = document.getElementById('sizeGrid');
    if (!sizeGrid) return;

    sizeGrid.innerHTML = '';

    commonSizes.forEach(size => {
        const div = document.createElement('div');
        div.className = 'size-option';
        div.innerHTML = `
            <input type="checkbox" id="size-${size}" class="size-checkbox" onchange="toggleSize('${size}')">
            <label for="size-${size}" class="size-label">${size}</label>
        `;
        sizeGrid.appendChild(div);
    });
}

// Add these functions to handle size selection
function toggleSize(size) {
    const checkbox = document.getElementById(`size-${size}`);

    if (checkbox.checked) {
        if (!selectedSizes.includes(size)) {
            selectedSizes.push(size);
        }
    } else {
        selectedSizes = selectedSizes.filter(s => s !== size);
    }

    updateSelectedSizes();
}

function addCustomSize() {
    const input = document.getElementById('customSize');
    const customSize = input.value.trim().toUpperCase();

    if (customSize && !selectedSizes.includes(customSize) && !commonSizes.includes(customSize)) {
        selectedSizes.push(customSize);
        input.value = '';
        updateSelectedSizes();

        // Add to the grid if it exists
        const sizeGrid = document.getElementById('sizeGrid');
        if (sizeGrid) {
            const div = document.createElement('div');
            div.className = 'size-option';
            div.innerHTML = `
                <input type="checkbox" id="size-${customSize}" class="size-checkbox" onchange="toggleSize('${customSize}')" checked>
                <label for="size-${customSize}" class="size-label">${customSize}</label>
            `;
            sizeGrid.appendChild(div);
        }
    } else if (selectedSizes.includes(customSize) || commonSizes.includes(customSize)) {
        alert('Size already exists!');
    }
}

function removeSize(size) {
    selectedSizes = selectedSizes.filter(s => s !== size);
    const checkbox = document.getElementById(`size-${size}`);
    if (checkbox) {
        checkbox.checked = false;
    }
    updateSelectedSizes();
}

function updateSelectedSizes() {
    const selectedSizesDiv = document.getElementById('selectedSizes');
    const sizeTagsDiv = document.getElementById('sizeTags');

    if (!selectedSizesDiv || !sizeTagsDiv) return;

    if (selectedSizes.length > 0) {
        selectedSizesDiv.style.display = 'block';
        sizeTagsDiv.innerHTML = selectedSizes.map(size => `
            <span class="badge bg-primary me-1">
                ${size}
                <button type="button" class="btn-close btn-close-white btn-sm ms-1" onclick="removeSize('${size}')"></button>
            </span>
        `).join('');
    } else {
        selectedSizesDiv.style.display = 'none';
    }
}

// Call this in your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    initializeSizeSelection();

    // Also handle Enter key in custom size input
    const customSizeInput = document.getElementById('customSize');
    if (customSizeInput) {
        customSizeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addCustomSize();
            }
        });
    }
});

// Update the product data object in the addProductBtn click handler to include sizes
// In the saveProduct function, modify the productData object to include:
const productData = {
    // ... existing properties ...
    sizes: selectedSizes.join(', ') || 'One Size'
};
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with sample data if localStorage is empty
    initializeSampleData();
    renderProducts();

    // Left nav toggle
    document.getElementById('menuIcon') ? .addEventListener('click', function() {
        const leftNav = document.getElementById('leftNav');
        leftNav.style.display = leftNav.style.display === 'block' ? 'none' : 'block';
    });

    // Profile menu toggle
    document.getElementById('profileIcon') ? .addEventListener('click', function(e) {
        e.stopPropagation();
        const menu = document.getElementById('profileMenu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    // Close profile menu when clicking outside
    document.addEventListener('click', function() {
        const profileMenu = document.getElementById('profileMenu');
        if (profileMenu) profileMenu.style.display = 'none';
    });

    // Submenu toggles
    document.getElementById('onlineStoreToggle') ? .addEventListener('click', function() {
        const sub = document.getElementById('onlineStoreSub');
        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById('catalogToggle') ? .addEventListener('click', function() {
        const sub = document.getElementById('catalogSub');
        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById('customersToggle') ? .addEventListener('click', function() {
        const sub = document.getElementById('customersSub');
        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
    });

    // Initialize with sample data if localStorage is empty
    function initializeSampleData() {
        const sampleProducts = [{
                productId: "PR001",
                productName: "Diamond Necklace",
                categories: "Necklaces",
                stock: "In Stock",
                imageSrc: "https://via.placeholder.com/50",
                shopByOptions: "Wedding Wear, Party Wear",
                price: "25000.00",
                discount: "10",
                gst: "18",
                couponCode: "DIAMOND10",
                totalPrice: "24300.00",
                quantity: "1",
                offers: "Free Shipping, 10% Cashback"
            },
            {
                productId: "PR002",
                productName: "Gold Ring",
                categories: "Rings",
                stock: "In Stock",
                imageSrc: "https://via.placeholder.com/50",
                shopByOptions: "Wedding Wear",
                price: "15000.00",
                discount: "5",
                gst: "18",
                couponCode: "GOLD5",
                totalPrice: "16237.50",
                quantity: "2",
                offers: "Buy 1 Get 1"
            }
        ];

        const products = JSON.parse(localStorage.getItem('products') || '[]');
        if (products.length === 0) {
            localStorage.setItem('products', JSON.stringify(sampleProducts));
        }
    }

    // Calculate total price when inputs change
    document.getElementById('price').addEventListener('input', calculateTotal);
    document.getElementById('discount').addEventListener('input', calculateTotal);
    document.getElementById('gst').addEventListener('input', calculateTotal);
    document.getElementById('quantity').addEventListener('input', calculateTotal);

    function calculateTotal() {
        const price = parseFloat(document.getElementById('price').value) || 0;
        const discount = parseFloat(document.getElementById('discount').value) || 0;
        const gst = parseFloat(document.getElementById('gst').value) || 0;
        const quantity = parseInt(document.getElementById('quantity').value) || 1;

        const discountAmount = price * (discount / 100);
        const subtotal = (price - discountAmount) * quantity;
        const gstAmount = subtotal * (gst / 100);
        const total = subtotal + gstAmount;

        document.getElementById('totalPrice').value = total.toFixed(2);
    }

    // Save products to localStorage
    function saveProducts(products) {
        try {
            localStorage.setItem('products', JSON.stringify(products));
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                alert("Storage is full! Clearing old data...");
                localStorage.clear();
                localStorage.setItem('products', JSON.stringify(products));
            } else {
                alert("Error saving products: " + error.message);
            }
        }
    }

    // Load products from localStorage
    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        return products;
    }

    // Render products to table
    function renderProducts(products = null) {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        const productsToRender = products || loadProducts();

        productsToRender.forEach(product => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
    <td><input type="checkbox" class="row-checkbox"></td>
    <td>${product.productId}</td>
    <td>${product.productName}</td>
    <td>${product.categories}</td>
    <td>${product.stock}</td>
    <td><img src="${product.imageSrc}" alt="Product" style="width:50px;height:50px;"></td>
    <td>${product.shopByOptions}</td>
    <td>₹${product.price}</td>
    <td>${product.discount}%</td>
    <td>${product.gst}%</td>
    <td>${product.couponCode}</td>
    <td>₹${product.totalPrice}</td>
    <td>${product.quantity}</td>
    <td>${product.sizes || 'One Size'}</td>
    <td>${product.offers || ''}</td>
    <td class="action-buttons">
        <button class="btn btn-sm btn-outline-info inventory-btn" title="Inventory"><i class="fas fa-box"></i></button>
        <button class="btn btn-sm btn-outline-primary edit-btn" data-product-id="${product.productId}"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-product-id="${product.productId}"><i class="fas fa-trash"></i></button>
    </td>
`;
            tbody.appendChild(newRow);
        });

        // Add event listeners after rendering
        attachEventListeners();
    }

    // Attach event listeners to dynamically created elements
    function attachEventListeners() {
        // Delete button listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const productId = this.getAttribute('data-product-id');

                if (confirm(`Are you sure you want to delete product ${productId}?`)) {
                    const products = loadProducts();
                    const updatedProducts = products.filter(p => p.productId !== productId);
                    saveProducts(updatedProducts);
                    renderProducts();
                }
            });
        });

        // Inventory button listeners
        document.querySelectorAll('.inventory-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const row = this.closest('tr');
                const productId = row.cells[1].textContent;
                const productName = row.cells[2].textContent;
                const price = row.cells[7].textContent;
                const quantity = row.cells[12].textContent;
                const totalPrice = row.cells[11].textContent;

                // Show invoice modal or alert
                alert(`Invoice for ${productName}\nProduct ID: ${productId}\nUnit Price: ${price}\nQuantity: ${quantity}\nTotal: ${totalPrice}`);
            });
        });

        // Edit button listeners
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const productId = this.getAttribute('data-product-id');
                const products = loadProducts();
                const productToEdit = products.find(p => p.productId === productId);

                if (productToEdit) {
                    // Check if modal exists
                    const modal = document.getElementById('addProductModal');
                    if (!modal) {
                        alert('Edit modal not found. Please ensure the modal HTML is present.');
                        return;
                    }

                    // Populate the modal with product data
                    const orderIdField = document.getElementById('orderId');
                    const productNameField = document.getElementById('productName');
                    const stockField = document.getElementById('stock');
                    const priceField = document.getElementById('price');
                    const discountField = document.getElementById('discount');
                    const gstField = document.getElementById('gst');
                    const couponCodeField = document.getElementById('couponCode');
                    const totalPriceField = document.getElementById('totalPrice');
                    const quantityField = document.getElementById('quantity');

                    if (orderIdField) orderIdField.value = productToEdit.productId;
                    if (productNameField) productNameField.value = productToEdit.productName;
                    if (stockField) stockField.value = productToEdit.stock;
                    if (priceField) priceField.value = parseFloat(productToEdit.price);
                    if (discountField) discountField.value = parseFloat(productToEdit.discount);
                    if (gstField) gstField.value = parseFloat(productToEdit.gst);
                    if (couponCodeField) couponCodeField.value = productToEdit.couponCode;
                    if (totalPriceField) totalPriceField.value = parseFloat(productToEdit.totalPrice);
                    if (quantityField) quantityField.value = productToEdit.quantity;

                    // Set shop by options if exists
                    const shopBySelect = document.getElementById('shopBy');
                    if (shopBySelect) {
                        const shopByOptions = productToEdit.shopByOptions.split(',').map(s => s.trim());
                        Array.from(shopBySelect.options).forEach(option => {
                            option.selected = shopByOptions.includes(option.value);
                        });
                    }

                    // Set categories checkboxes if they exist
                    const categories = productToEdit.categories.split(',').map(s => s.trim());
                    document.getElementById('rings') && (document.getElementById('rings').checked = categories.includes('Rings'));
                    document.getElementById('necklaces') && (document.getElementById('necklaces').checked = categories.includes('Necklaces'));
                    document.getElementById('earrings') && (document.getElementById('earrings').checked = categories.includes('Earrings'));
                    document.getElementById('bracelets') && (document.getElementById('bracelets').checked = categories.includes('Bracelets'));

                    // Set offers if they exist
                    if (productToEdit.offers) {
                        document.getElementById('offer1') && (document.getElementById('offer1').checked = productToEdit.offers.includes('Free Shipping'));
                        document.getElementById('offer2') && (document.getElementById('offer2').checked = productToEdit.offers.includes('Buy 1 Get 1'));
                        document.getElementById('offer3') && (document.getElementById('offer3').checked = productToEdit.offers.includes('10% Cashback'));
                    }

                    // Change modal title and button
                    const modalLabel = document.getElementById('addProductModalLabel');
                    const addBtn = document.getElementById('addProductBtn');
                    if (modalLabel) modalLabel.textContent = 'Edit Product';
                    if (addBtn) {
                        addBtn.textContent = 'Update Product';
                        addBtn.dataset.editingId = productId;
                    }

                    // Show the modal using Bootstrap
                    if (typeof bootstrap !== 'undefined') {
                        const editModal = new bootstrap.Modal(modal);
                        editModal.show();
                    } else {
                        // Fallback if Bootstrap is not available
                        modal.style.display = 'block';
                    }
                }
            });
        });

        // Individual checkbox listeners
        document.querySelectorAll('.row-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const allCheckboxes = document.querySelectorAll('.row-checkbox');
                const checkedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
                const selectAllCheckbox = document.querySelector('th input[type="checkbox"]');

                if (selectAllCheckbox) {
                    selectAllCheckbox.checked = allCheckboxes.length === checkedCheckboxes.length;
                }
            });
        });
    }

    // Toggle select all checkboxes
    function toggleSelectAll(selectAllCheckbox) {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    }

    // Make toggleSelectAll globally accessible
    window.toggleSelectAll = toggleSelectAll;

    // Get selected offers from form
    function getSelectedOffers() {
        const option1 = document.getElementById('option1');
        if (option1 && option1.checked) {
            const selected = [];
            if (document.getElementById('offer1') ? .checked) selected.push('Free Shipping');
            if (document.getElementById('offer2') ? .checked) selected.push('Buy 1 Get 1');
            if (document.getElementById('offer3') ? .checked) selected.push('10% Cashback');
            return selected.join(', ');
        } else {
            const offerValue = document.getElementById('offerValue');
            return offerValue ? 'Discount: ' + offerValue.value + '%' : '';
        }
    }

    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            const isEditing = this.dataset.editingId;
            const products = loadProducts();

            // Get form values
            const productIdField = document.getElementById('orderId');
            const productNameField = document.getElementById('productName');
            const stockField = document.getElementById('stock');
            const priceField = document.getElementById('price');
            const discountField = document.getElementById('discount');
            const gstField = document.getElementById('gst');
            const couponCodeField = document.getElementById('couponCode');
            const totalPriceField = document.getElementById('totalPrice');
            const quantityField = document.getElementById('quantity');

            if (!productIdField || !productNameField) {
                alert('Required form fields not found');
                return;
            }

            const productId = productIdField.value;
            const productName = productNameField.value;

            if (!productId || !productName) {
                alert('Product ID and Product Name are required');
                return;
            }

            const shopBySelect = document.getElementById('shopBy');
            const shopByOptions = shopBySelect ?
                Array.from(shopBySelect.selectedOptions).map(option => option.value).join(', ') : '';

            // Get selected categories
            const categories = [];
            if (document.getElementById('rings') ? .checked) categories.push('Rings');
            if (document.getElementById('necklaces') ? .checked) categories.push('Necklaces');
            if (document.getElementById('earrings') ? .checked) categories.push('Earrings');
            if (document.getElementById('bracelets') ? .checked) categories.push('Bracelets');

            const productData = {
                productId,
                productName,
                categories: categories.join(', ') || 'Uncategorized',
                stock: stockField ? stockField.value : 'In Stock',
                imageSrc: 'https://via.placeholder.com/50',
                shopByOptions,
                price: priceField ? priceField.value : '0.00',
                discount: discountField ? discountField.value : '0',
                gst: gstField ? gstField.value : '0',
                couponCode: couponCodeField ? couponCodeField.value : '',
                totalPrice: totalPriceField ? totalPriceField.value : '0.00',
                quantity: quantityField ? quantityField.value : '1',
                offers: getSelectedOffers()
            };

            // Handle image if uploaded
            const imageFile = document.getElementById('productImage') ? .files[0];
            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    productData.imageSrc = e.target.result;
                    saveProduct();
                }
                reader.readAsDataURL(imageFile);
            } else {
                saveProduct();
            }

            function saveProduct() {
                // Add this productData object right here, replacing any existing product data object
                const productData = {
                    productId,
                    productName,
                    categories: categories.join(', ') || 'Uncategorized',
                    stock: stockField ? stockField.value : 'In Stock',
                    imageSrc: 'https://via.placeholder.com/50',
                    shopByOptions,
                    price: priceField ? priceField.value : '0.00',
                    discount: discountField ? discountField.value : '0',
                    gst: gstField ? gstField.value : '0',
                    couponCode: couponCodeField ? couponCodeField.value : '',
                    totalPrice: totalPriceField ? totalPriceField.value : '0.00',
                    quantity: quantityField ? quantityField.value : '1',
                    sizes: selectedSizes.join(', ') || 'One Size',
                    offers: getSelectedOffers()
                };

                if (isEditing) {
                    // Update existing product
                    const index = products.findIndex(p => p.productId === isEditing);
                    if (index !== -1) {
                        products[index] = productData;
                    }
                } else {
                    // Check if product ID already exists
                    if (products.find(p => p.productId === productId)) {
                        alert('Product ID already exists. Please use a different ID.');
                        return;
                    }
                    // Add new product
                    products.push(productData);
                }

                saveProducts(products);
                renderProducts();

                // Close modal and reset
                const modal = document.getElementById('addProductModal');
                if (modal) {
                    if (typeof bootstrap !== 'undefined') {
                        const modalInstance = bootstrap.Modal.getInstance(modal);
                        if (modalInstance) modalInstance.hide();
                    } else {
                        modal.style.display = 'none';
                    }
                }

                const form = document.getElementById('productForm');
                if (form) form.reset();
                if (totalPriceField) totalPriceField.value = '';

                const modalLabel = document.getElementById('addProductModalLabel');
                if (modalLabel) modalLabel.textContent = 'Add New Product';
                this.textContent = 'Add Product';
                delete this.dataset.editingId;
            }
        });
    }

    // Delete selected products
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', function() {
            const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
            if (selectedCheckboxes.length === 0) {
                alert('Please select at least one product to delete');
                return;
            }

            if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected product(s)?`)) {
                const productIds = Array.from(selectedCheckboxes).map(checkbox => {
                    return checkbox.closest('tr').cells[1].textContent;
                });

                const products = loadProducts();
                const updatedProducts = products.filter(p => !productIds.includes(p.productId));
                saveProducts(updatedProducts);
                renderProducts();

                // Uncheck select all checkbox if it was checked
                const selectAllCheckbox = document.querySelector('th input[type="checkbox"]');
                if (selectAllCheckbox) {
                    selectAllCheckbox.checked = false;
                }
            }
        });
    }

    // Store current filter values
    let currentFilters = {
        category: 'all',
        price: 'all'
    };

    // Filter products based on search, category, and price
    function filterProducts() {
        const searchInput = document.getElementById('searchInput');
        const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedCategory = currentFilters.category;
        const selectedPrice = currentFilters.price;

        const products = loadProducts();

        const filteredProducts = products.filter(product => {
            // Search filter - search in Product ID and Product Name
            const matchesSearch = searchText === '' ||
                product.productId.toLowerCase().includes(searchText) ||
                product.productName.toLowerCase().includes(searchText);

            // Category filter
            const matchesCategory = selectedCategory === 'all' ||
                product.categories.toLowerCase().includes(selectedCategory.toLowerCase());

            // Price filter
            const price = parseFloat(product.price);
            let matchesPrice = true;

            if (selectedPrice === 'under10000') {
                matchesPrice = price < 10000;
            } else if (selectedPrice === '10000-100000') {
                matchesPrice = price >= 10000 && price <= 100000;
            } else if (selectedPrice === 'over100000') {
                matchesPrice = price > 100000;
            }

            return matchesSearch && matchesCategory && matchesPrice;
        });

        renderProducts(filteredProducts);
    }

    // Reset filters and show all products
    function resetFilters() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';

        // Reset filter values
        currentFilters.category = 'all';
        currentFilters.price = 'all';

        // Reset dropdown selections
        document.querySelectorAll('#categoryDropdown + .dropdown-menu .dropdown-item, #priceDropdown + .dropdown-menu .dropdown-item')
            .forEach(item => item.classList.remove('active'));
        document.querySelector('#categoryDropdown + .dropdown-menu .dropdown-item[data-value="all"]') ? .classList.add('active');
        document.querySelector('#priceDropdown + .dropdown-menu .dropdown-item[data-value="all"]') ? .classList.add('active');

        // Update dropdown button text
        const categoryDropdown = document.getElementById('categoryDropdown');
        const priceDropdown = document.getElementById('priceDropdown');
        if (categoryDropdown) categoryDropdown.textContent = 'Category';
        if (priceDropdown) priceDropdown.textContent = 'Price';

        // Render all products
        renderProducts();

        // Close dropdowns if open
        if (typeof bootstrap !== 'undefined') {
            const categoryDropdownInstance = bootstrap.Dropdown.getInstance(categoryDropdown);
            const priceDropdownInstance = bootstrap.Dropdown.getInstance(priceDropdown);
            if (categoryDropdownInstance) categoryDropdownInstance.hide();
            if (priceDropdownInstance) priceDropdownInstance.hide();
        }
    }

    // Filter button
    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            filterProducts();
        });
    }

    // Search button
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            filterProducts();
        });
    }

    // Also filter when pressing Enter in search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                filterProducts();
            }
        });
    }

    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetFilters();
        });
    }

    // Category dropdown items
    document.querySelectorAll('#categoryDropdown + .dropdown-menu .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all items
            document.querySelectorAll('#categoryDropdown + .dropdown-menu .dropdown-item').forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');

            // Update current filter
            currentFilters.category = this.getAttribute('data-value') || 'all';

            const categoryText = this.textContent;
            const categoryDropdown = document.getElementById('categoryDropdown');
            if (categoryDropdown) categoryDropdown.textContent = categoryText;
        });
    });

    // Price dropdown items
    document.querySelectorAll('#priceDropdown + .dropdown-menu .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all items
            document.querySelectorAll('#priceDropdown + .dropdown-menu .dropdown-item').forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');

            // Update current filter
            currentFilters.price = this.getAttribute('data-value') || 'all';

            const priceText = this.textContent;
            const priceDropdown = document.getElementById('priceDropdown');
            if (priceDropdown) priceDropdown.textContent = priceText;
        });
    });

    // Import file handler
    window.handleImport = function() {
        const fileInput = document.getElementById('fileInput');
        if (fileInput && fileInput.files.length > 0) {
            alert(`Importing ${fileInput.files.length} file(s)`);
            // Here you would typically process the file and add products
        } else {
            alert('Please select files first');
        }
    };

    // Offer type toggle
    const option1 = document.getElementById('option1');
    const option2 = document.getElementById('option2');

    if (option1) {
        option1.addEventListener('change', function() {
            if (this.checked) {
                const option1Options = document.getElementById('option1Options');
                const option2Input = document.getElementById('option2Input');
                if (option1Options) option1Options.style.display = 'block';
                if (option2Input) option2Input.style.display = 'none';
            }
        });
    }

    if (option2) {
        option2.addEventListener('change', function() {
            if (this.checked) {
                const option1Options = document.getElementById('option1Options');
                const option2Input = document.getElementById('option2Input');
                if (option1Options) option1Options.style.display = 'none';
                if (option2Input) option2Input.style.display = 'block';
            }
        });
    }

    // Export functionality
    function exportToExcel() {
        try {
            const products = loadProducts();
            if (products.length === 0) {
                alert('No data to export');
                return;
            }

            // Create workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(products.map(product => ({
                'Product ID': product.productId,
                'Product Name': product.productName,
                'Categories': product.categories,
                'Stock': product.stock,
                'Shop By Options': product.shopByOptions,
                'Price': product.price,
                'Discount': product.discount + '%',
                'GST': product.gst + '%',
                'Coupon Code': product.couponCode,
                'Total Price': product.totalPrice,
                'Quantity': product.quantity,
                'Offers': product.offers
            })));

            XLSX.utils.book_append_sheet(wb, ws, 'Products');
            XLSX.writeFile(wb, 'products_export.xlsx');
        } catch (error) {
            console.error('Export to Excel failed:', error);
            alert('Excel export failed. Please ensure XLSX library is loaded.');
        }
    }

    function exportToCSV() {
        try {
            const products = loadProducts();
            if (products.length === 0) {
                alert('No data to export');
                return;
            }

            // Create CSV content
            const headers = ['Product ID', 'Product Name', 'Categories', 'Stock', 'Shop By Options', 'Price', 'Discount', 'GST', 'Coupon Code', 'Total Price', 'Quantity', 'Offers'];
            const csvContent = [
                headers.join(','),
                ...products.map(product => [
                    `"${product.productId}"`,
                    `"${product.productName}"`,
                    `"${product.categories}"`,
                    `"${product.stock}"`,
                    `"${product.shopByOptions}"`,
                    `"${product.price}"`,
                    `"${product.discount}%"`,
                    `"${product.gst}%"`,
                    `"${product.couponCode}"`,
                    `"${product.totalPrice}"`,
                    `"${product.quantity}"`,
                    `"${product.offers}"`
                ].join(','))
            ].join('\n');

            // Create and download CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'products_export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export to CSV failed:', error);
            alert('CSV export failed.');
        }
    }

    // Add event listeners to export dropdown items
    document.addEventListener('click', function(e) {
        if (e.target.textContent.includes('Excel') || e.target.closest('.dropdown-item').textContent.includes('Excel')) {
            e.preventDefault();
            exportToExcel();
        } else if (e.target.textContent.includes('CSV') || e.target.closest('.dropdown-item') ? .textContent.includes('CSV')) {
            e.preventDefault();
            exportToCSV();
        }
    });

    // Make export functions globally accessible
    window.exportToExcel = exportToExcel;
    window.exportToCSV = exportToCSV;
});