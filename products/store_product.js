// Add these variables at the top of your script with other variables
const commonSizes = ['4', '5', '6', '7', '8', '9', '10', 'S', 'M', 'L', 'XL'];
let selectedSizes = [];
let selectedUnavailableSizes = [];

// Add this function to initialize the size selection
function initializeSizeSelection() {
    const sizeGrid = document.getElementById('sizeGrid');
    if (!sizeGrid) return;

    // Size buttons are already in HTML, just add event listeners
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const size = this.getAttribute('data-size');
            toggleSize(size, this);
        });
    });

    // Unavailable size buttons
    document.querySelectorAll('.unavailable-size-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const size = this.getAttribute('data-size');
            toggleUnavailableSize(size, this);
        });
    });
}

// Add these functions to handle size selection
function toggleSize(size, button) {
    if (selectedSizes.includes(size)) {
        selectedSizes = selectedSizes.filter(s => s !== size);
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline-secondary');
    } else {
        selectedSizes.push(size);
        button.classList.remove('btn-outline-secondary');
        button.classList.add('btn-primary');
    }
    updateSelectedSizes();
}

function toggleUnavailableSize(size, button) {
    if (selectedUnavailableSizes.includes(size)) {
        selectedUnavailableSizes = selectedUnavailableSizes.filter(s => s !== size);
        button.classList.remove('btn-danger');
        button.classList.add('btn-outline-danger');
    } else {
        selectedUnavailableSizes.push(size);
        button.classList.remove('btn-outline-danger');
        button.classList.add('btn-danger');
    }
    updateSelectedUnavailableSizes();
}

function addCustomSize() {
    const input = document.getElementById('customSize');
    const customSize = input.value.trim().toUpperCase();

    if (customSize && !selectedSizes.includes(customSize)) {
        selectedSizes.push(customSize);
        input.value = '';
        updateSelectedSizes();

        // Add to the grid if it exists
        const sizeGrid = document.getElementById('sizeGrid');
        if (sizeGrid) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-primary size-btn';
            button.setAttribute('data-size', customSize);
            button.textContent = customSize;
            button.addEventListener('click', function(e) {
                e.preventDefault();
                toggleSize(customSize, this);
            });
            sizeGrid.appendChild(button);
        }
    } else if (selectedSizes.includes(customSize)) {
        alert('Size already exists!');
    }
}

function removeSize(size) {
    selectedSizes = selectedSizes.filter(s => s !== size);
    const button = document.querySelector(`.size-btn[data-size="${size}"]`);
    if (button) {
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline-secondary');
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

function updateSelectedUnavailableSizes() {
    const selectedUnavailableSizesDiv = document.getElementById('selectedUnavailableSizes');
    const unavailableSizeTagsDiv = document.getElementById('unavailableSizeTags');

    if (!selectedUnavailableSizesDiv || !unavailableSizeTagsDiv) return;

    if (selectedUnavailableSizes.length > 0) {
        selectedUnavailableSizesDiv.style.display = 'block';
        unavailableSizeTagsDiv.innerHTML = selectedUnavailableSizes.map(size => `
            <span class="badge bg-danger me-1">
                ${size}
                <button type="button" class="btn-close btn-close-white btn-sm ms-1" onclick="removeUnavailableSize('${size}')"></button>
            </span>
        `).join('');
    } else {
        selectedUnavailableSizesDiv.style.display = 'none';
    }
}

function removeUnavailableSize(size) {
    selectedUnavailableSizes = selectedUnavailableSizes.filter(s => s !== size);
    const button = document.querySelector(`.unavailable-size-btn[data-size="${size}"]`);
    if (button) {
        button.classList.remove('btn-danger');
        button.classList.add('btn-outline-danger');
    }
    updateSelectedUnavailableSizes();
}

document.addEventListener('DOMContentLoaded', function() {
            // Initialize with sample data if localStorage is empty
            initializeSampleData();
            renderProducts();
            initializeSizeSelection();
            // Replace your existing left nav toggle section with this improved version
            // This goes inside your DOMContentLoaded event listener

            // Left nav toggle - improved implementation
            document.querySelectorAll('.category').forEach(category => {
                const toggleIcon = category.querySelector('i');
                const subMenu = category.nextElementSibling;

                // Only add handlers if this category has a submenu
                if (subMenu && subMenu.classList.contains('sub-category')) {
                    // Click handler for the entire category div
                    category.addEventListener('click', function(e) {
                        // Don't toggle if clicking on a link inside the category
                        if (e.target.tagName !== 'A') {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleSubMenu(subMenu, toggleIcon);
                        }
                    });

                    // Click handler for the chevron icon if it exists
                    if (toggleIcon) {
                        toggleIcon.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleSubMenu(subMenu, toggleIcon);
                        });
                    }
                }
            });

            // Also add these specific handlers for your existing toggle elements
            const onlineStoreToggle = document.getElementById('onlineStoreToggle');
            if (onlineStoreToggle) {
                onlineStoreToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const sub = document.getElementById('onlineStoreSub');
                    if (sub) {
                        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
                        const icon = this.querySelector('i');
                        if (icon) {
                            icon.classList.toggle('fa-chevron-down');
                            icon.classList.toggle('fa-chevron-up');
                        }
                    }
                });
            }

            const catalogToggle = document.getElementById('catalogToggle');
            if (catalogToggle) {
                catalogToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const sub = document.getElementById('catalogSub');
                    if (sub) {
                        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
                        const icon = this.querySelector('i');
                        if (icon) {
                            icon.classList.toggle('fa-chevron-down');
                            icon.classList.toggle('fa-chevron-up');
                        }
                    }
                });
            }

            const customersToggle = document.getElementById('customersToggle');
            if (customersToggle) {
                customersToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const sub = document.getElementById('customersSub');
                    if (sub) {
                        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
                        const icon = this.querySelector('i');
                        if (icon) {
                            icon.classList.toggle('fa-chevron-down');
                            icon.classList.toggle('fa-chevron-up');
                        }
                    }
                });
            }

            // Helper function to toggle submenus
            function toggleSubMenu(subMenu, toggleIcon) {
                if (!subMenu) return;

                const isVisible = subMenu.style.display === 'block';
                subMenu.style.display = isVisible ? 'none' : 'block';

                if (toggleIcon) {
                    toggleIcon.classList.toggle('fa-chevron-down');
                    toggleIcon.classList.toggle('fa-chevron-up');
                }
            }


            // Left nav toggle
            document.getElementById('menuIcon').addEventListener('click', function() {
                const leftNav = document.getElementById('leftNav');
                leftNav.style.display = leftNav.style.display === 'block' ? 'none' : 'block';
            });

            // Profile menu toggle (keep existing)
            document.getElementById('profileIcon').addEventListener('click', function(e) {
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

            // Handle Enter key in custom size input
            const customSizeInput = document.getElementById('customSize');
            if (customSizeInput) {
                customSizeInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomSize();
                    }
                });
            }

            // Initialize with sample data if localStorage is empty
            function initializeSampleData() {
                const sampleProducts = [{
                        productId: "PR001",
                        productTitle: "Diamond Necklace",
                        category: "necklaces",
                        stock: "in-stock",
                        imageSrc: "https://via.placeholder.com/50",

                        shopBy: "wedding",
                        price: "25000.00",
                        oldPrice: "28000.00",
                        discount: "10%",
                        couponCode: "DIAMOND10",
                        quantity: "5",
                        sizes: "S, M, L",
                        rating: "4.5",
                        sku: "DN001"
                    },
                    {
                        productId: "PR002",
                        productTitle: "Gold Ring",
                        category: "rings",
                        stock: "in-stock",
                        imageSrc: "https://via.placeholder.com/50",
                        shopBy: "jewelry",
                        price: "15000.00",
                        oldPrice: "16000.00",
                        discount: "6%",
                        couponCode: "GOLD5",
                        quantity: "10",
                        sizes: "6, 7, 8, 9",
                        rating: "4.8",
                        sku: "GR001"
                    }
                ];

                const products = JSON.parse(localStorage.getItem('products') || '[]');
                if (products.length === 0) {
                    localStorage.setItem('products', JSON.stringify(sampleProducts));
                }
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
            <td>${product.productTitle}</td>
            <td>${product.category}</td>
            <td><span class="badge ${product.stock === 'in-stock' ? 'bg-success' : 'bg-danger'}">${product.stock === 'in-stock' ? 'In Stock' : 'Out of Stock'}</span></td>
            <td><img src="${product.imageSrc}" alt="Product" style="width:50px;height:50px;border-radius:5px;"></td>
            <td>${product.subImages && product.subImages !== 'N/A' ? 
                product.subImages.split(',').map(img => 
                    `<img src="${img.trim()}" alt="Sub" style="width:30px;height:30px;border-radius:3px;margin-right:2px;">`
                ).join('') : 'N/A'}</td>
            <td>${product.shopBy}</td>
            <td>₹${product.price}</td>
            <td>₹${product.oldPrice || 'N/A'}</td>
            <td>${product.discount || '0%'}</td>
            <td>${product.couponCode || 'N/A'}</td>
            <td>${product.quantity}</td>
            <td>${product.rating ? '⭐ ' + product.rating : 'N/A'}</td>
            <td>${product.sku}</td>
            <td>${product.description || 'N/A'}</td>
            <td>${product.features || 'N/A'}</td>
            <td>${product.stoneColor || 'N/A'}</td>
            <td>${product.metalColor || 'N/A'}</td>
            <td>${product.sizes || 'One Size'}</td>
            <td>${product.unavailableSizes || 'N/A'}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-outline-primary edit-btn" data-product-id="${product.productId}" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-product-id="${product.productId}" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(newRow);
    });

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

        // Edit button listeners
document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const productId = this.getAttribute('data-product-id');
        const products = loadProducts();
        const productToEdit = products.find(p => p.productId === productId);

        if (productToEdit) {
            populateEditForm(productToEdit);
            const modal = document.getElementById('addProductModal');
            if (modal) {
                // Change modal title and button
                document.getElementById('addProductModalLabel').textContent = 'Edit Product';
                const addBtn = document.getElementById('addProductBtn');
                addBtn.textContent = 'Update Product';
                addBtn.dataset.editingId = productId;
                
                if (typeof bootstrap !== 'undefined') {
                    const editModal = new bootstrap.Modal(modal);
                    editModal.show();
                } else {
                    modal.style.display = 'block';
                }
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

    // Populate edit form
    // Update the populateEditForm function to include all fields
    function populateEditForm(product) {
        document.getElementById('productTitle').value = product.productTitle || '';
        document.getElementById('skuNo').value = product.sku || '';
        document.getElementById('productPrice').value = parseFloat(product.price) || '';
        document.getElementById('productOldPrice').value = parseFloat(product.oldPrice) || '';
        document.getElementById('productDiscount').value = product.discount || '';
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productFeatures').value = product.features || '';
        document.getElementById('productCategory').value = product.category || '';
        document.getElementById('shopBy').value = product.shopBy || '';
        document.getElementById('productStock').value = product.stock || 'in-stock';
        document.getElementById('productQuantity').value = product.quantity || '1';
        document.getElementById('rating').value = product.rating || '';
        document.getElementById('stoneColor').value = product.stoneColor || '';
        document.getElementById('metalColor').value = product.metalColor || '';
        document.getElementById('productCouponCode').value = product.couponCode || '';

        // Set sizes
        if (product.sizes) {
            const productSizes = product.sizes.split(',').map(s => s.trim());
            selectedSizes = [...productSizes];
            updateSelectedSizes();

            // Update size buttons
            document.querySelectorAll('.size-btn').forEach(btn => {
                const size = btn.getAttribute('data-size');
                if (productSizes.includes(size)) {
                    btn.classList.remove('btn-outline-secondary');
                    btn.classList.add('btn-primary');
                } else {
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-outline-secondary');
                }
            });
        }

        // Set unavailable sizes
        if (product.unavailableSizes) {
            const productUnavailableSizes = product.unavailableSizes.split(',').map(s => s.trim());
            selectedUnavailableSizes = [...productUnavailableSizes];
            updateSelectedUnavailableSizes();

            // Update unavailable size buttons
            document.querySelectorAll('.unavailable-size-btn').forEach(btn => {
                const size = btn.getAttribute('data-size');
                if (productUnavailableSizes.includes(size)) {
                    btn.classList.remove('btn-outline-danger');
                    btn.classList.add('btn-danger');
                } else {
                    btn.classList.remove('btn-danger');
                    btn.classList.add('btn-outline-danger');
                }
            });
        }

        // Change modal title and button
        const modalLabel = document.getElementById('addProductModalLabel');
        const addBtn = document.getElementById('addProductBtn');
        if (modalLabel) modalLabel.textContent = 'Edit Product';
        if (addBtn) {
            addBtn.textContent = 'Update Product';
            addBtn.dataset.editingId = product.productId;
        }
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

    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {

       // Update the addProductBtn click event handler
addProductBtn.addEventListener('click', function() {
    const isEditing = this.dataset.editingId;
    const products = loadProducts();

    // Get form values
    const productTitle = document.getElementById('productTitle').value.trim();
    const skuNo = document.getElementById('skuNo').value.trim();
    const productPrice = document.getElementById('productPrice').value;
    const productOldPrice = document.getElementById('productOldPrice').value;
    const productDiscount = document.getElementById('productDiscount').value;
    const productDescription = document.getElementById('productDescription').value.trim();
    const productFeatures = document.getElementById('productFeatures').value.trim();
    const productCategory = document.getElementById('productCategory').value;
    const shopBy = document.getElementById('shopBy').value.trim();
    const productStock = document.getElementById('productStock').value;
    const productQuantity = document.getElementById('productQuantity').value;
    const rating = document.getElementById('rating').value;
    const stoneColor = document.getElementById('stoneColor').value.trim();
    const metalColor = document.getElementById('metalColor').value.trim();
    const productCouponCode = document.getElementById('productCouponCode').value.trim();

    // Validation
    if (!productTitle || !skuNo || !productPrice || !productCategory) {
        alert('Please fill in all required fields (Product Title, SKU, Price, and Category)');
        return;
    }

    // Generate product ID if not editing
    const productId = isEditing || 'PR' + String(Date.now()).slice(-6);

    // Create product data object first
    const productData = {
        productId,
        productTitle,
        category: productCategory,
        stock: productStock,
        imageSrc: 'https://via.placeholder.com/50', // Default image
        subImages: 'N/A', // Default value
        shopBy,
        price: productPrice,
        oldPrice: productOldPrice || '',
        discount: productDiscount || '0%',
        couponCode: productCouponCode,
        quantity: productQuantity,
        sizes: selectedSizes.join(', ') || 'One Size',
        rating: rating || '',
        sku: skuNo,
        description: productDescription,
        features: productFeatures,
        stoneColor: stoneColor,
        metalColor: metalColor,
        unavailableSizes: selectedUnavailableSizes.join(', ') || ''
    };

    // Handle image if uploaded
    const imageFile = document.getElementById('productImage').files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            productData.imageSrc = e.target.result;
            handleSubImages(productData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        handleSubImages(productData);
    }

    function handleSubImages(productData) {
        const subImageFiles = document.getElementById('productSubImages').files;
        if (subImageFiles && subImageFiles.length > 0) {
            const subImageReaders = [];
            const subImages = [];
            
            for (let i = 0; i < Math.min(subImageFiles.length, 4); i++) {
                const reader = new FileReader();
                subImageReaders.push(reader);
                
                reader.onload = function(e) {
                    subImages.push(e.target.result);
                    if (subImages.length === Math.min(subImageFiles.length, 4)) {
                        productData.subImages = subImages.join(', ');
                        saveProduct(productData, isEditing);
                    }
                };
                reader.readAsDataURL(subImageFiles[i]);
            }
        } else {
            saveProduct(productData, isEditing);
        }
    }

    function saveProduct(productData, isEditing) {
        const products = loadProducts();
        
        if (isEditing) {
            // Update existing product
            const index = products.findIndex(p => p.productId === productData.productId);
            if (index !== -1) {
                products[index] = productData;
            }
        } else {
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

        resetForm();
    }
});
    }

    // Reset form function
    function resetForm() {
        const form = document.getElementById('productForm');
        if (form) form.reset();

        // Reset sizes
        selectedSizes = [];
        selectedUnavailableSizes = [];
        updateSelectedSizes();
        updateSelectedUnavailableSizes();

        // Reset size buttons
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-secondary');
        });

        document.querySelectorAll('.unavailable-size-btn').forEach(btn => {
            btn.classList.remove('btn-danger');
            btn.classList.add('btn-outline-danger');
        });

        // Reset modal title and button
        const modalLabel = document.getElementById('addProductModalLabel');
        const addBtn = document.getElementById('addProductBtn');
        if (modalLabel) modalLabel.textContent = 'Add New Product';
        if (addBtn) {
            addBtn.textContent = 'Add Product';
            delete addBtn.dataset.editingId;
        }
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
            // Search filter - search in Product Title and SKU
            const matchesSearch = searchText === '' ||
                product.productTitle.toLowerCase().includes(searchText) ||
                product.sku.toLowerCase().includes(searchText);

            // Category filter
            const matchesCategory = selectedCategory === 'all' ||
                product.category === selectedCategory;

            // Price filter
            const price = parseFloat(product.price);
            let matchesPrice = true;

            if (selectedPrice === 'under500') {
                matchesPrice = price < 500;
            } else if (selectedPrice === '500-1000') {
                matchesPrice = price >= 500 && price <= 1000;
            } else if (selectedPrice === 'over1000') {
                matchesPrice = price > 1000;
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
        document.querySelector('#categoryDropdown + .dropdown-menu .dropdown-item[data-value="all"]').classList.add('active');
        document.querySelector('#priceDropdown + .dropdown-menu .dropdown-item[data-value="all"]').classList.add('active');

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

    // Delete selected products functionality
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
    function exportToExcel() {
    try {
        const products = loadProducts();
        if (products.length === 0) {
            alert('No data to export');
            return;
        }

        // Prepare data for export
        const exportData = products.map(product => ({
            'Product ID': product.productId,
            'Product Title': product.productTitle,
            'Category': product.category,
            'Stock': product.stock,
            'Image': product.imageSrc,
            'Sub Images': product.subImages || 'N/A',
            'Shop By': product.shopBy,
            'Price (₹)': product.price,
            'Old Price (₹)': product.oldPrice || 'N/A',
            'Discount': product.discount || '0%',
            'Coupon Code': product.couponCode || 'N/A',
            'Quantity': product.quantity,
            'Rating': product.rating || 'N/A',
            'SKU': product.sku,
            'Description': product.description || 'N/A',
            'Features': product.features || 'N/A',
            'Stone Color': product.stoneColor || 'N/A',
            'Metal Color': product.metalColor || 'N/A',
            'Available Sizes': product.sizes || 'One Size',
            'Unavailable Sizes': product.unavailableSizes || 'N/A'
        }));

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, 'Products');
        XLSX.writeFile(wb, 'products_export.xlsx');
    } catch (error) {
        console.error('Export to Excel failed:', error);
        alert('Excel export failed. Please try again.');
    }
}

function exportToCSV() {
    try {
        const products = loadProducts();
        if (products.length === 0) {
            alert('No data to export');
            return;
        }

        // Prepare data for export
        const exportData = products.map(product => ({
            'Product ID': product.productId,
            'Product Title': product.productTitle,
            'Category': product.category,
            'Stock': product.stock,
            'Image': product.imageSrc,
            'Sub Images': product.subImages || 'N/A',
            'Shop By': product.shopBy,
            'Price (₹)': product.price,
            'Old Price (₹)': product.oldPrice || 'N/A',
            'Discount': product.discount || '0%',
            'Coupon Code': product.couponCode || 'N/A',
            'Quantity': product.quantity,
            'Rating': product.rating || 'N/A',
            'SKU': product.sku,
            'Description': product.description || 'N/A',
            'Features': product.features || 'N/A',
            'Stone Color': product.stoneColor || 'N/A',
            'Metal Color': product.metalColor || 'N/A',
            'Available Sizes': product.sizes || 'One Size',
            'Unavailable Sizes': product.unavailableSizes || 'N/A'
        }));

        // Create CSV content
        const headers = Object.keys(exportData[0]);
        const csvRows = [
            headers.join(','),
            ...exportData.map(row => 
                headers.map(fieldName => 
                    `"${String(row[fieldName]).replace(/"/g, '""')}"`
                ).join(',')
            )
        ];

        const csvContent = csvRows.join('\n');
        
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
        setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
        console.error('Export to CSV failed:', error);
        alert('CSV export failed. Please try again.');
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
            const headers = [
                'Product ID', 'Product Title', 'Category', 'Stock', 'Image', 'Sub Images',
                'Shop By', 'Price', 'Old Price', 'Discount', 'Coupon Code', 'Quantity',
                'Rating', 'SKU', 'Description', 'Features', 'Stone Color', 'Metal Color',
                'Available Sizes', 'Unavailable Sizes'
            ];

            const csvContent = [
                headers.join(','),
                ...products.map(product => [
                    `"${product.productId}"`,
                    `"${product.productTitle}"`,
                    `"${product.category}"`,
                    `"${product.stock}"`,
                    `"${product.imageSrc}"`,
                    `"${product.subImages || ''}"`,
                    `"${product.shopBy}"`,
                    `"${product.price}"`,
                    `"${product.oldPrice || ''}"`,
                    `"${product.discount || ''}"`,
                    `"${product.couponCode || ''}"`,
                    `"${product.quantity}"`,
                    `"${product.rating || ''}"`,
                    `"${product.sku}"`,
                    `"${product.description || ''}"`,
                    `"${product.features || ''}"`,
                    `"${product.stoneColor || ''}"`,
                    `"${product.metalColor || ''}"`,
                    `"${product.sizes || ''}"`,
                    `"${product.unavailableSizes || ''}"`
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
        if (e.target.textContent.includes('Excel') || (e.target.closest('.dropdown-item') && e.target.closest('.dropdown-item').textContent.includes('Excel'))) {
            e.preventDefault();
            exportToExcel();
        } else if (e.target.textContent.includes('CSV') || (e.target.closest('.dropdown-item') && e.target.closest('.dropdown-item').textContent.includes('CSV'))) {
            e.preventDefault();
            exportToCSV();
        }
    });

    // Make export functions globally accessible
    window.exportToExcel = exportToExcel;
    window.exportToCSV = exportToCSV;
});