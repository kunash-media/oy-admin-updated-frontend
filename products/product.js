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
    });}



// product.js
const API_BASE_URL = 'http://localhost:8080/api/products';

let products = [];
let currentEditingId = null;
let currentMainImageData = null;
let currentSubImagesData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('productForm').addEventListener('submit', handleFormSubmit);
    
    // Close modal when clicking outside
    document.getElementById('productModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeProductModal();
        }
    });
    
    // Handle file input validation
    document.getElementById('productSubImages').addEventListener('change', function(e) {
        if (e.target.files.length > 5) {
            alert('Maximum 5 sub-images allowed');
            e.target.value = '';
            return;
        }
        previewSubImages(e.target);
    });
    
    // Handle main image preview
    document.getElementById('productImage').addEventListener('change', function(e) {
        previewMainImage(e.target);
    });
}

// Load all products
async function loadProducts() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/get-all-product`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        products = await response.json();
        renderProductTable();
        showLoading(false);
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products. Please check if the server is running.');
        showLoading(false);
    }
}

// Render product table
function renderProductTable(filteredProducts = null) {
    const tableBody = document.getElementById('productTableBody');
    const productsToRender = filteredProducts || products;
    
    if (productsToRender.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="14" style="text-align: center; padding: 40px;">No products found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = productsToRender.map(product => {
        const mainImage = renderImage(product.ProductImage, 'product-image');
        const subImages = renderSubImages(product.ProductSubImages);
        const stockClass = getStockClass(product.ProductStock);
        
        return `
            <tr>
                <td>${product.productId}</td>
                <td>${mainImage}</td>
                <td>${subImages}</td>
                <td>${product.ProductTitle}</td>
                <td>₹${product.ProductPrice}</td>
                <td>${product.ProductOldPrice ? '₹' + product.ProductOldPrice : '-'}</td>
                <td>${formatCategory(product.ProductCategory)}</td>
                <td><span class="${stockClass}">${formatStock(product.ProductStock)}</span></td>
                <td>${product.productQuantity}</td>
                <td>${formatSizes(product.ProductSizes)}</td>
                <td>${product.productDiscount || '-'}</td>
                <td>${product.rating || '-'}</td>
                <td>${product.skuNo || '-'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="editProduct(${product.productId})">Edit</button>
                        <button class="delete-btn" onclick="deleteProduct(${product.productId})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Render image from base64 data
function renderImage(imageData, className) {
    if (!imageData) return '<span>No image</span>';
    
    try {
        // Handle base64 multipart data
        const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData;
        const imgSrc = `data:image/jpeg;base64,${base64Data}`;
        return `<img src="${imgSrc}" class="${className}" alt="Product Image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAzNUMyNS42MDQ0IDM1IDI2LjEwNzggMzQuNDA1NiAyNi4xMDc4IDMzLjY0MjlWMjEuMzU3MUMyNi4xMDc4IDIwLjU5NDQgMjUuNjA0NCAyMCAyNSAyMEMyNC4zOTU2IDIwIDIzLjg5MjIgMjAuNTk0NCAyMy44OTIyIDIxLjM1NzFWMzMuNjQyOUMyMy44OTIyIDM0LjQwNTYgMjQuMzk1NiAzNSAyNSAzNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg=='; this.alt='Image not available';">`;
    } catch (error) {
        return '<span>Invalid image</span>';
    }
}

// Render sub-images
function renderSubImages(subImages) {
    if (!subImages || subImages.length === 0) return '<span>No sub-images</span>';
    
    return `<div class="sub-images">
        ${subImages.map(img => renderImage(img, 'sub-image')).join('')}
    </div>`;
}

// Format category
function formatCategory(category) {
    if (!category) return '-';
    return category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Format stock status
function formatStock(stock) {
    if (!stock) return '-';
    return stock.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Get stock class for styling
function getStockClass(stock) {
    if (!stock) return '';
    switch (stock.toLowerCase()) {
        case 'in-stock': return 'stock-in';
        case 'out-of-stock': return 'stock-out';
        case 'limited-stock': return 'stock-limited';
        default: return '';
    }
}

// Format sizes array
function formatSizes(sizes) {
    if (!sizes || sizes.length === 0) return '-';
    return sizes.join(', ');
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    let filteredProducts = products;
    
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.ProductTitle.toLowerCase().includes(searchTerm)
        );
    }
    
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(product => 
            product.ProductCategory.toLowerCase() === categoryFilter.toLowerCase()
        );
    }
    
    renderProductTable(filteredProducts);
}

// Filter by category
function filterByCategory() {
    searchProducts(); // Reuse the search function as it handles both search and filter
}

// Open add product modal
function openAddProductModal() {
    currentEditingId = null;
    currentMainImageData = null;
    currentSubImagesData = [];
    document.getElementById('modalTitle').textContent = 'Add Product';
    document.getElementById('submitBtn').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productImage').setAttribute('required', 'required');
    
    // Hide current images
    document.getElementById('currentMainImage').style.display = 'none';
    document.getElementById('currentSubImages').style.display = 'none';
    
    // Clear previews
    document.getElementById('mainImagePreview').innerHTML = '';
    document.getElementById('subImagesPreview').innerHTML = '';
    
    document.getElementById('productModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    currentEditingId = null;
    currentMainImageData = null;
    currentSubImagesData = [];
}

// Preview main image
function previewMainImage(input) {
    const preview = document.getElementById('mainImagePreview');
    preview.innerHTML = '';
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Main Image Preview" style="max-width: 200px; max-height: 200px; border: 1px solid #ddd; border-radius: 4px;">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Preview sub images
function previewSubImages(input) {
    const preview = document.getElementById('subImagesPreview');
    preview.innerHTML = '';
    
    if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100px';
                img.style.maxHeight = '100px';
                img.style.margin = '5px';
                img.style.border = '1px solid #ddd';
                img.style.borderRadius = '4px';
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }
}

// Remove current main image
function removeCurrentMainImage() {
    currentMainImageData = null;
    document.getElementById('currentMainImage').style.display = 'none';
    document.getElementById('productImage').setAttribute('required', 'required');
}

// Remove current sub image
function removeCurrentSubImage(index) {
    currentSubImagesData.splice(index, 1);
    displayCurrentSubImages();
}

// Display current sub images
function displayCurrentSubImages() {
    const container = document.getElementById('currentSubImagesDisplay');
    container.innerHTML = '';
    
    if (currentSubImagesData.length === 0) {
        document.getElementById('currentSubImages').style.display = 'none';
        return;
    }
    
    currentSubImagesData.forEach((imageData, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'current-image-wrapper';
        wrapper.style.display = 'inline-block';
        wrapper.style.margin = '5px';
        wrapper.style.position = 'relative';
        
        const img = document.createElement('img');
        img.src = `data:image/jpeg;base64,${imageData}`;
        img.className = 'current-image';
        img.style.maxWidth = '100px';
        img.style.maxHeight = '100px';
        img.style.border = '1px solid #ddd';
        img.style.borderRadius = '4px';
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-image-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.style.position = 'absolute';
        removeBtn.style.top = '-5px';
        removeBtn.style.right = '-5px';
        removeBtn.style.backgroundColor = 'red';
        removeBtn.style.color = 'white';
        removeBtn.style.border = 'none';
        removeBtn.style.borderRadius = '50%';
        removeBtn.style.width = '20px';
        removeBtn.style.height = '20px';
        removeBtn.style.fontSize = '12px';
        removeBtn.style.cursor = 'pointer';
        removeBtn.onclick = () => removeCurrentSubImage(index);
        
        wrapper.appendChild(img);
        wrapper.appendChild(removeBtn);
        container.appendChild(wrapper);
    });
}

// Edit product
async function editProduct(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${productId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const product = await response.json();
        
        // Populate form with product data
        document.getElementById('productTitle').value = product.ProductTitle || '';
        document.getElementById('productPrice').value = product.ProductPrice || '';
        document.getElementById('productOldPrice').value = product.ProductOldPrice || '';
        document.getElementById('productCategory').value = product.ProductCategory || '';
        document.getElementById('productStock').value = product.ProductStock || '';
        document.getElementById('productQuantity').value = product.productQuantity || '';
        document.getElementById('shopBy').value = product.shopBy || '';
        document.getElementById('productDiscount').value = product.productDiscount || '';
        document.getElementById('productCouponCode').value = product.productCouponCode || '';
        document.getElementById('stoneColor').value = product.stoneColor || '';
        document.getElementById('metalColor').value = product.metalColor || '';
        document.getElementById('skuNo').value = product.skuNo || '';
        document.getElementById('rating').value = product.rating || '';
        document.getElementById('productDescription').value = product.productDescription || '';
        document.getElementById('productFeatures').value = product.productFeatures ? product.productFeatures.join('\n') : '';
        document.getElementById('productSizes').value = product.ProductSizes ? product.ProductSizes.join(', ') : '';
        document.getElementById('productUnavailableSizes').value = product.productUnavailableSizes ? product.productUnavailableSizes.join(', ') : '';
        
        // Handle main image
        if (product.ProductImage) {
            currentMainImageData = product.ProductImage;
            const mainImageSrc = `data:image/jpeg;base64,${product.ProductImage}`;
            document.getElementById('currentMainImageDisplay').src = mainImageSrc;
            document.getElementById('currentMainImage').style.display = 'block';
            // Add styling to prevent overflow
    currentMainImage.style.maxWidth = '100%';
    currentMainImage.style.height = '50%';
    // currentMainImage.style.overflow = 'hidden';
    currentMainImage.style.objectFit = 'contain'; 
            document.getElementById('productImage').removeAttribute('required');
        }
        
        // Handle sub images
        if (product.ProductSubImages && product.ProductSubImages.length > 0) {
            currentSubImagesData = [...product.ProductSubImages];
            displayCurrentSubImages();
            document.getElementById('currentSubImages').style.display = 'block';
        }
        
        // Set modal for editing
        currentEditingId = productId;
        document.getElementById('modalTitle').textContent = 'Edit Product';
        document.getElementById('submitBtn').textContent = 'Update Product';
        document.getElementById('productModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Clear previews
        document.getElementById('mainImagePreview').innerHTML = '';
        document.getElementById('subImagesPreview').innerHTML = '';
        
    } catch (error) {
        console.error('Error fetching product for edit:', error);
        showError('Failed to load product details for editing.');
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
        return;
    }
    
    const formData = new FormData();
    
    // Prepare product data as JSON object
    const productData = {
        productTitle: document.getElementById('productTitle').value.trim(),
        productPrice: document.getElementById('productPrice').value,
        productOldPrice: document.getElementById('productOldPrice').value || null,
        productCategory: document.getElementById('productCategory').value,
        productStock: document.getElementById('productStock').value,
        productQuantity: parseInt(document.getElementById('productQuantity').value),
        shopBy: document.getElementById('shopBy').value || 'jewelry',
        productDiscount: document.getElementById('productDiscount').value || null,
        productCouponCode: document.getElementById('productCouponCode').value || null,
        stoneColor: document.getElementById('stoneColor').value || null,
        metalColor: document.getElementById('metalColor').value || null,
        skuNo: document.getElementById('skuNo').value || null,
        rating: document.getElementById('rating').value || null,
        productDescription: document.getElementById('productDescription').value || null
    };
    
    // Process sizes arrays
    const sizesInput = document.getElementById('productSizes').value;
    if (sizesInput) {
        const sizes = sizesInput.split(',').map(size => size.trim()).filter(size => size);
        productData.productSizes = sizes;
    } else {
        productData.productSizes = [];
    }
    
    const unavailableSizesInput = document.getElementById('productUnavailableSizes').value;
    if (unavailableSizesInput) {
        const unavailableSizes = unavailableSizesInput.split(',').map(size => size.trim()).filter(size => size);
        productData.productUnavailableSizes = unavailableSizes;
    } else {
        productData.productUnavailableSizes = [];
    }
    
    // Process features array
    const featuresInput = document.getElementById('productFeatures').value;
    if (featuresInput) {
        const features = featuresInput.split('\n').map(feature => feature.trim()).filter(feature => feature);
        productData.productFeatures = features;
    } else {
        productData.productFeatures = [];
    }
    
    // Add product data as JSON string
    formData.append('productData', JSON.stringify(productData));
    
    // Handle main image
    const mainImageFile = document.getElementById('productImage').files[0];

    if (mainImageFile) {

        formData.append('productImage', mainImageFile);

    } else if (currentEditingId && currentMainImageData) {

        // For editing, if no new image selected, create a blob from existing image data
        const base64Data = currentMainImageData.includes(',') ? 
            currentMainImageData.split(',')[1] : currentMainImageData;

        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'image/jpeg' });
        formData.append('productImage', blob, 'existing-image.jpg');
    }
    // Handle sub images
    const subImageFiles = document.getElementById('productSubImages').files;

    if (subImageFiles && subImageFiles.length > 0) {
        Array.from(subImageFiles).forEach((file) => {
            formData.append('productSubImages', file);
        });
    }
    
    // For editing, include existing sub images that weren't removed
    if (currentEditingId && currentSubImagesData.length > 0) {
        currentSubImagesData.forEach((imageData, index) => {
            const base64Data = imageData.includes(',') ? 
                imageData.split(',')[1] : imageData;
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'image/jpeg' });
            formData.append('productSubImages', blob, `existing-sub-image-${index}.jpg`);
        });
    }
    
    // If no sub images at all, append empty array placeholder
    if ((!subImageFiles || subImageFiles.length === 0) && 
        (!currentEditingId || currentSubImagesData.length === 0)) {
        // Create empty file for sub images to satisfy backend expectation
        const emptyBlob = new Blob([], { type: 'image/jpeg' });
        formData.append('productSubImages', emptyBlob, 'empty.jpg');
    }
    
    try {
        showLoading(true);
        
        const url = currentEditingId ? 
            `${API_BASE_URL}/update-product/${currentEditingId}` : 
            `${API_BASE_URL}/create-product`;
        
        const method = currentEditingId ? 'PATCH' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData || errorMessage;
            } catch (jsonError) {
                // If response is not JSON, try to get text
                try {
                    const textError = await response.text();
                    errorMessage = textError || errorMessage;
                } catch (textError) {
                    // Keep the original error message
                }
            }
            throw new Error(errorMessage);
        }
        
        const result = await response.json();
        
        showLoading(false);
        closeProductModal();
        
        // Clear draft after successful submission
        clearDraft();
        
        // Show success message
        showSuccess(currentEditingId ? 'Product updated successfully!' : 'Product added successfully!');
        
        // Reload products
        await loadProducts();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showError(error.message || 'Failed to save product. Please try again.');
        showLoading(false);
    }
}

// Enhanced validation function
function validateForm() {
    const title = document.getElementById('productTitle').value.trim();
    const price = document.getElementById('productPrice').value;
    const category = document.getElementById('productCategory').value;
    const stock = document.getElementById('productStock').value;
    const quantity = document.getElementById('productQuantity').value;
    const mainImage = document.getElementById('productImage').files[0];
    
    // Check required fields
    if (!title) {
        showError('Product title is required');
        document.getElementById('productTitle').focus();
        return false;
    }
    
    if (!price || parseFloat(price) <= 0) {
        showError('Valid price is required');
        document.getElementById('productPrice').focus();
        return false;
    }
    
    if (!category) {
        showError('Product category is required');
        document.getElementById('productCategory').focus();
        return false;
    }
    
    if (!stock) {
        showError('Stock status is required');
        document.getElementById('productStock').focus();
        return false;
    }
    
    if (!quantity || parseInt(quantity) < 0) {
        showError('Valid quantity is required');
        document.getElementById('productQuantity').focus();
        return false;
    }
    
    // Check main image for new products
    if (!currentEditingId && !mainImage) {
        showError('Main product image is required');
        document.getElementById('productImage').focus();
        return false;
    }
    
    // Validate sub images count
    const subImages = document.getElementById('productSubImages').files;
    const totalSubImages = (subImages ? subImages.length : 0) + 
                          (currentEditingId ? currentSubImagesData.length : 0);
    
    if (totalSubImages > 5) {
        showError('Maximum 5 sub-images allowed');
        document.getElementById('productSubImages').focus();
        return false;
    }
    
    // Validate price format
    const oldPrice = document.getElementById('productOldPrice').value;
    if (oldPrice && parseFloat(oldPrice) <= parseFloat(price)) {
        if (!confirm('Old price should be higher than current price. Do you want to continue?')) {
            return false;
        }
    }
    
    // Validate rating
    const rating = document.getElementById('rating').value;
    if (rating && (parseFloat(rating) < 0 || parseFloat(rating) > 5)) {
        showError('Rating must be between 0 and 5');
        document.getElementById('rating').focus();
        return false;
    }
    
    return true;
}
// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/delete-product/${productId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        showLoading(false);
        showSuccess('Product deleted successfully!');
        
        // Reload products
        await loadProducts();
        
    } catch (error) {
        console.error('Error deleting product:', error);
        showError('Failed to delete product. Please try again.');
        showLoading(false);
    }
}

// Show loading indicator
function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = show ? 'block' : 'none';
    }
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.backgroundColor = '#f8d7da';
        errorElement.style.color = '#721c24';
        errorElement.style.border = '1px solid #f5c6cb';
        errorElement.style.padding = '10px';
        errorElement.style.borderRadius = '4px';
        errorElement.style.margin = '10px 0';
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

// Show success message
function showSuccess(message) {
    // Create success element if it doesn't exist
    let successElement = document.getElementById('success');
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.id = 'success';
        successElement.className = 'success';
        const container = document.querySelector('.container');
        container.insertBefore(successElement, container.firstChild);
    }
    
    successElement.textContent = message;
    successElement.style.display = 'block';
    successElement.style.backgroundColor = '#d4edda';
    successElement.style.color = '#155724';
    successElement.style.border = '1px solid #c3e6cb';
    successElement.style.padding = '10px';
    successElement.style.borderRadius = '4px';
    successElement.style.margin = '10px 0';
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 3000);
}

// Reset form to initial state
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('mainImagePreview').innerHTML = '';
    document.getElementById('subImagesPreview').innerHTML = '';
    document.getElementById('currentMainImage').style.display = 'none';
    document.getElementById('currentSubImages').style.display = 'none';
    document.getElementById('productImage').setAttribute('required', 'required');
    currentEditingId = null;
    currentMainImageData = null;
    currentSubImagesData = [];
}

// Validate form before submission
function validateForm() {
    const title = document.getElementById('productTitle').value.trim();
    const price = document.getElementById('productPrice').value;
    const category = document.getElementById('productCategory').value;
    const stock = document.getElementById('productStock').value;
    const quantity = document.getElementById('productQuantity').value;
    const mainImage = document.getElementById('productImage').files[0];
    
    // Check required fields
    if (!title) {
        showError('Product title is required');
        return false;
    }
    
    if (!price || price <= 0) {
        showError('Valid price is required');
        return false;
    }
    
    if (!category) {
        showError('Product category is required');
        return false;
    }
    
    if (!stock) {
        showError('Stock status is required');
        return false;
    }
    
    if (!quantity || quantity < 0) {
        showError('Valid quantity is required');
        return false;
    }
    
    // Check main image for new products
    if (!currentEditingId && !mainImage) {
        showError('Main product image is required');
        return false;
    }
    
    // Validate sub images count
    const subImages = document.getElementById('productSubImages').files;
    if (subImages && subImages.length > 5) {
        showError('Maximum 5 sub-images allowed');
        return false;
    }
    
    return true;
}

// Export products to CSV
function exportToCSV() {
    if (products.length === 0) {
        showError('No products to export');
        return;
    }
    
    const csvHeaders = [
        'ID', 'Title', 'Price', 'Old Price', 'Category', 'Stock', 'Quantity', 
        'Sizes', 'Discount', 'Rating', 'SKU', 'Stone Color', 'Metal Color', 
        'Description', 'Features', 'Shop By', 'Coupon Code', 'Unavailable Sizes'
    ];
    
    const csvData = products.map(product => [
        product.productId,
        product.ProductTitle,
        product.ProductPrice,
        product.ProductOldPrice || '',
        product.ProductCategory,
        product.ProductStock,
        product.productQuantity,
        product.ProductSizes ? product.ProductSizes.join('; ') : '',
        product.productDiscount || '',
        product.rating || '',
        product.skuNo || '',
        product.stoneColor || '',
        product.metalColor || '',
        product.productDescription || '',
        product.productFeatures ? product.productFeatures.join('; ') : '',
        product.shopBy || '',
        product.productCouponCode || '',
        product.productUnavailableSizes ? product.productUnavailableSizes.join('; ') : ''
    ]);
    
    const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccess('Products exported successfully!');
}

// Clear all filters and search
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    renderProductTable();
}

// Handle image upload errors
function handleImageError(img) {
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAzNUMyNS42MDQ0IDM1IDI2LjEwNzggMzQuNDA1NiAyNi4xMDc4IDMzLjY0MjlWMjEuMzU3MUMyNi4xMDc4IDIwLjU5NDQgMjUuNjA0NCAyMCAyNSAyMEMyNC4zOTU2IDIwIDIzLjg5MjIgMjAuNTk0NCAyMy44OTIyIDIxLjM1NzFWMzMuNjQyOUMyMy44OTIyIDM0LjQwNTYgMjQuMzk1NiAzNSAyNSAzNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==';
    img.alt = 'Image not available';
}

// Get product statistics
function getProductStats() {
    const stats = {
        total: products.length,
        inStock: products.filter(p => p.ProductStock === 'in-stock').length,
        outOfStock: products.filter(p => p.ProductStock === 'out-of-stock').length,
        limitedStock: products.filter(p => p.ProductStock === 'limited-stock').length,
        categories: {}
    };
    
    // Count products by category
    products.forEach(product => {
        const category = product.ProductCategory;
        stats.categories[category] = (stats.categories[category] || 0) + 1;
    });
    
    return stats;
}

// Display product statistics
function displayStats() {
    const stats = getProductStats();
    const statsHTML = `
        <div class="stats-container">
            <h3>Product Statistics</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <h4>Total Products</h4>
                    <p>${stats.total}</p>
                </div>
                <div class="stat-card">
                    <h4>In Stock</h4>
                    <p>${stats.inStock}</p>
                </div>
                <div class="stat-card">
                    <h4>Out of Stock</h4>
                    <p>${stats.outOfStock}</p>
                </div>
                <div class="stat-card">
                    <h4>Limited Stock</h4>
                    <p>${stats.limitedStock}</p>
                </div>
            </div>
            <div class="category-stats">
                <h4>Products by Category</h4>
                ${Object.entries(stats.categories).map(([category, count]) => 
                    `<div class="category-stat">
                        <span>${formatCategory(category)}</span>
                        <span>${count}</span>
                    </div>`
                ).join('')}
            </div>
        </div>
    `;
    
    // Create or update stats modal
    let statsModal = document.getElementById('statsModal');
    if (!statsModal) {
        statsModal = document.createElement('div');
        statsModal.id = 'statsModal';
        statsModal.className = 'modal';
        statsModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Product Statistics</h2>
                    <span class="close" onclick="closeStatsModal()">&times;</span>
                </div>
                <div id="statsContent"></div>
            </div>
        `;
        document.body.appendChild(statsModal);
    }
    
    document.getElementById('statsContent').innerHTML = statsHTML;
    statsModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close stats modal
function closeStatsModal() {
    const statsModal = document.getElementById('statsModal');
    if (statsModal) {
        statsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Sort products by different criteria
function sortProducts(criteria) {
    let sortedProducts = [...products];
    
    switch (criteria) {
        case 'title':
            sortedProducts.sort((a, b) => a.ProductTitle.localeCompare(b.ProductTitle));
            break;
        case 'price':
            sortedProducts.sort((a, b) => parseFloat(a.ProductPrice) - parseFloat(b.ProductPrice));
            break;
        case 'category':
            sortedProducts.sort((a, b) => a.ProductCategory.localeCompare(b.ProductCategory));
            break;
        case 'stock':
            sortedProducts.sort((a, b) => a.ProductStock.localeCompare(b.ProductStock));
            break;
        case 'id':
            sortedProducts.sort((a, b) => a.productId - b.productId);
            break;
        default:
            break;
    }
    
    renderProductTable(sortedProducts);
}

// Bulk operations
function bulkDelete() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    if (selectedIds.length === 0) {
        showError('Please select products to delete');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected products?`)) {
        return;
    }
    
    // Perform bulk delete operation
    selectedIds.forEach(async (id) => {
        try {
            await fetch(`${API_BASE_URL}/delete-product/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error(`Error deleting product ${id}:`, error);
        }
    });
    
    showSuccess(`${selectedIds.length} products deleted successfully!`);
    loadProducts();
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+N or Cmd+N for new product
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openAddProductModal();
    }
    
    // Escape key to close modal
    if (e.key === 'Escape') {
        closeProductModal();
        closeStatsModal();
    }
    
    // Ctrl+S or Cmd+S to save (if modal is open)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        const modal = document.getElementById('productModal');
        if (modal && modal.style.display === 'block') {
            e.preventDefault();
            document.getElementById('productForm').requestSubmit();
        }
    }
});

// Initialize tooltips and help text
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            tooltip.style.display = 'block';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Auto-save draft functionality
let autoSaveTimer;
function autoSaveDraft() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        const formData = {
            title: document.getElementById('productTitle').value,
            price: document.getElementById('productPrice').value,
            category: document.getElementById('productCategory').value,
            // ... other fields
        };
        
        // Save to localStorage (if available)
        if (typeof Storage !== 'undefined') {
            localStorage.setItem('product_draft', JSON.stringify(formData));
        }
    }, 2000); // Save after 2 seconds of inactivity
}

// Load draft on form open
function loadDraft() {
    if (typeof Storage !== 'undefined' && localStorage.getItem('product_draft')) {
        const draft = JSON.parse(localStorage.getItem('product_draft'));
        // Populate form with draft data
        Object.keys(draft).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = draft[key];
            }
        });
    }
}

// Clear draft after successful submission
function clearDraft() {
    if (typeof Storage !== 'undefined') {
        localStorage.removeItem('product_draft');
    }
}

// Error handling for network issues
function handleNetworkError(error) {
    if (!navigator.onLine) {
        showError('You are offline. Please check your internet connection.');
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showError('Unable to connect to the server. Please check if the server is running.');
    } else {
        showError('An unexpected error occurred. Please try again.');
    }
}

// Add event listeners for network status
window.addEventListener('online', function() {
    showSuccess('Connection restored!');
    loadProducts(); // Refresh data when back online
});

window.addEventListener('offline', function() {
    showError('You are now offline. Some features may not work.');
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    initializeTooltips();
    
    // Add auto-save listeners to form inputs
    const formInputs = document.querySelectorAll('#productForm input, #productForm select, #productForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', autoSaveDraft);
        input.addEventListener('change', autoSaveDraft);
    });
});