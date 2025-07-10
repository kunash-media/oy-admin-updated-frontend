

class BannerManager {
    constructor() {
        this.banners = [];
        this.filteredBanners = [];
        this.currentEditId = null;
        this.baseUrl = 'http://localhost:8080/api/banners';
        this.maxImagesForBannerOne = 5;

        this.initializeElements();
        this.attachEventListeners();
        this.loadBanners();
    }

    initializeElements() {
        // Main elements
        this.searchInput = document.getElementById('searchInput');
        this.addBannerBtn = document.getElementById('addBannerBtn');
        this.bannerTableBody = document.getElementById('bannerTableBody');
        this.loading = document.getElementById('loading');
        this.noData = document.getElementById('noData');

        // Modal elements
        this.bannerModal = document.getElementById('bannerModal');
        this.deleteModal = document.getElementById('deleteModal');
        this.closeModal = document.getElementById('closeModal');
        this.closeDeleteModal = document.getElementById('closeDeleteModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.bannerForm = document.getElementById('bannerForm');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.submitBtn = document.getElementById('submitBtn');
        this.cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

        // Form inputs
        this.pageNameInput = document.getElementById('pageName');
        this.headerInput = document.getElementById('header');
        this.textInput = document.getElementById('text');
        this.bannerFileOne = document.getElementById('bannerFileOne');
        this.bannerFileTwo = document.getElementById('bannerFileTwo');
        this.bannerFileThree = document.getElementById('bannerFileThree');
        this.bannerFileFour = document.getElementById('bannerFileFour');

        // Preview elements
        this.previewOne = document.getElementById('previewOne');
        this.previewTwo = document.getElementById('previewTwo');
        this.previewThree = document.getElementById('previewThree');
        this.previewFour = document.getElementById('previewFour');
    }

    attachEventListeners() {
        // Search functionality
        this.searchInput.addEventListener('input', (e) => {
            this.filterBanners(e.target.value);
        });

        // Add banner button
        this.addBannerBtn.addEventListener('click', () => {
            this.openModal('add');
        });

        // Modal close buttons
        this.closeModal.addEventListener('click', () => {
            this.closeModals();
        });

        this.closeDeleteModal.addEventListener('click', () => {
            this.closeModals();
        });

        this.cancelBtn.addEventListener('click', () => {
            this.closeModals();
        });

        this.cancelDeleteBtn.addEventListener('click', () => {
            this.closeModals();
        });

        // Form submission
        this.bannerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });

        // Delete confirmation
        this.confirmDeleteBtn.addEventListener('click', () => {
            this.deleteBanner();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.bannerModal || e.target === this.deleteModal) {
                this.closeModals();
            }
        });

        // File input previews
        this.bannerFileOne.addEventListener('change', (e) => {
            this.previewMultipleImages(e.target, this.previewOne);
        });

        this.bannerFileTwo.addEventListener('change', (e) => {
            this.previewImage(e.target, this.previewTwo);
        });

        this.bannerFileThree.addEventListener('change', (e) => {
            this.previewImage(e.target, this.previewThree);
        });

        this.bannerFileFour.addEventListener('change', (e) => {
            this.previewImage(e.target, this.previewFour);
        });
    }

    async loadBanners() {
        try {
            this.showLoading(true);
            const response = await fetch(`${this.baseUrl}/get-all-banners`);

            if (!response.ok) {
                throw new Error('Failed to fetch banners');
            }

            const data = await response.json();
            this.banners = data || [];
            this.filteredBanners = [...this.banners];
            this.renderTable();

        } catch (error) {
            console.error('Error loading banners:', error);
            this.showError('Failed to load banners. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    filterBanners(searchTerm) {
        const term = searchTerm.toLowerCase().trim();

        if (term === '') {
            this.filteredBanners = [...this.banners];
        } else {
            this.filteredBanners = this.banners.filter(banner =>
                banner.pageName && banner.pageName.toLowerCase().includes(term)
            );
        }

        this.renderTable();
    }

    renderTable() {
        if (this.filteredBanners.length === 0) {
            this.bannerTableBody.innerHTML = '';
            this.noData.style.display = 'block';
            return;
        }

        this.noData.style.display = 'none';

        const tableHTML = this.filteredBanners.map(banner => `
        <tr>
            <td>${this.escapeHtml(banner.pageName || '')}</td>
            <td>${this.escapeHtml(banner.header || '')}</td>
            <td>${this.escapeHtml(banner.text || '')}</td>
            <td>${this.renderMultipleImageCell(banner.bannerFileOne, 'jpeg')}</td>
            <td>${this.renderImageCell(banner.bannerFileTwo, 'jpeg')}</td>
            <td>${this.renderImageCell(banner.bannerFileThree, 'jpeg')}</td>
            <td>${this.renderImageCell(banner.bannerFileFour, 'jpeg')}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="bannerManager.editBanner(${banner.id})">
                        Edit
                    </button>
                    <button class="delete-btn" onclick="bannerManager.confirmDelete(${banner.id})">
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

        this.bannerTableBody.innerHTML = tableHTML;
    }

    renderMultipleImageCell(imageData, imageType = 'jpeg') {
        if (imageData && Array.isArray(imageData) && imageData.length > 0) {
            // Display multiple images with count
            const firstImage = imageData[0];
            let src;
            if (typeof firstImage === 'string' && firstImage.startsWith('data:')) {
                src = firstImage;
            } else {
                src = `data:image/${imageType};base64,${firstImage}`;
            }
            return `
                <div class="multiple-images-cell">
                    <img src="${src}" alt="Banner Image" class="image-cell">
                    <span class="image-count">${imageData.length} image${imageData.length > 1 ? 's' : ''}</span>
                </div>
            `;
        } else if (imageData && typeof imageData === 'string') {
            // Handle single image (backward compatibility)
            let src;
            if (imageData.startsWith('data:')) {
                src = imageData;
            } else {
                src = `data:image/${imageType};base64,${imageData}`;
            }
            return `<img src="${src}" alt="Banner Image" class="image-cell">`;
        } else {
            return '<div class="no-image">No Images</div>';
        }
    }

    renderImageCell(imageData, imageType = 'jpeg') {
        if (imageData) {
            // Check if it's already a data URL
            if (typeof imageData === 'string' && imageData.startsWith('data:')) {
                return `<img src="${imageData}" alt="Banner Image" class="image-cell">`;
            }
            // Otherwise format as base64 data URL
            return `<img src="data:image/${imageType};base64,${imageData}" alt="Banner Image" class="image-cell">`;
        } else {
            return '<div class="no-image">No Image</div>';
        }
    }

    openModal(mode, bannerId = null) {
        this.currentEditId = bannerId;

        if (mode === 'add') {
            this.modalTitle.textContent = 'Add Banner';
            this.submitBtn.textContent = 'Create Banner';
            this.resetForm();
        } else if (mode === 'edit') {
            this.modalTitle.textContent = 'Edit Banner';
            this.submitBtn.textContent = 'Update Banner';
            this.populateForm(bannerId);
        }

        this.bannerModal.style.display = 'block';
    }

    closeModals() {
        this.bannerModal.style.display = 'none';
        this.deleteModal.style.display = 'none';
        this.resetForm();
        this.currentEditId = null;
    }

    resetForm() {
        this.bannerForm.reset();
        this.clearPreviews();

        // Reset required attributes for edit mode
        this.bannerFileOne.required = true;
        this.bannerFileTwo.required = true;
    }

    populateForm(bannerId) {
        const banner = this.banners.find(b => b.id === bannerId);
        if (!banner) return;

        this.pageNameInput.value = banner.pageName || '';
        this.headerInput.value = banner.header || '';
        this.textInput.value = banner.text || '';

        // Make file inputs optional for edit mode
        this.bannerFileOne.required = false;
        this.bannerFileTwo.required = false;

        // Show existing images if available
        if (banner.bannerFileOne) {
            this.showExistingMultipleImages(this.previewOne, banner.bannerFileOne, 'jpeg');
        }
        if (banner.bannerFileTwo) {
            this.showExistingImage(this.previewTwo, banner.bannerFileTwo, 'jpeg');
        }
        if (banner.bannerFileThree) {
            this.showExistingImage(this.previewThree, banner.bannerFileThree, 'jpeg');
        }
        if (banner.bannerFileFour) {
            this.showExistingImage(this.previewFour, banner.bannerFileFour, 'jpeg');
        }
    }

    showExistingMultipleImages(previewElement, imageData, imageType = 'jpeg') {
        let html = '';
        
        if (Array.isArray(imageData)) {
            imageData.forEach((image, index) => {
                let src;
                if (typeof image === 'string' && image.startsWith('data:')) {
                    src = image;
                } else {
                    src = `data:image/${imageType};base64,${image}`;
                }
                html += `<div class="existing-image-preview">
                    <img src="${src}" alt="Current Image ${index + 1}">
                    <span class="image-label">Image ${index + 1}</span>
                </div>`;
            });
        } else if (typeof imageData === 'string') {
            // Handle single image (backward compatibility)
            let src;
            if (imageData.startsWith('data:')) {
                src = imageData;
            } else {
                src = `data:image/${imageType};base64,${imageData}`;
            }
            html = `<div class="existing-image-preview">
                <img src="${src}" alt="Current Image">
                <span class="image-label">Current Image</span>
            </div>`;
        }
        
        previewElement.innerHTML = html;
        previewElement.style.display = 'block';
    }

    showExistingImage(previewElement, imageData, imageType = 'jpeg') {
        let src;
        if (typeof imageData === 'string' && imageData.startsWith('data:')) {
            src = imageData;
        } else {
            src = `data:image/${imageType};base64,${imageData}`;
        }
        previewElement.innerHTML = `<img src="${src}" alt="Current Image">`;
        previewElement.style.display = 'block';
    }

    clearPreviews() {
        [this.previewOne, this.previewTwo, this.previewThree, this.previewFour].forEach(preview => {
            preview.innerHTML = '';
            preview.style.display = 'none';
        });
    }

    previewMultipleImages(input, previewElement) {
        if (input.files && input.files.length > 0) {
            // Check file limit
            if (input.files.length > this.maxImagesForBannerOne) {
                this.showError(`Maximum ${this.maxImagesForBannerOne} images allowed for Banner Images Set 1`);
                input.value = '';
                previewElement.innerHTML = '';
                previewElement.style.display = 'none';
                return;
            }

            let html = '';
            const fileArray = Array.from(input.files);
            let loadedCount = 0;

            fileArray.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    html += `<div class="image-preview-item">
                        <img src="${e.target.result}" alt="Preview ${index + 1}">
                        <span class="image-label">Image ${index + 1}</span>
                    </div>`;
                    
                    loadedCount++;
                    if (loadedCount === fileArray.length) {
                        previewElement.innerHTML = html;
                        previewElement.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            previewElement.innerHTML = '';
            previewElement.style.display = 'none';
        }
    }

    previewImage(input, previewElement) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function(e) {
                previewElement.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                previewElement.style.display = 'block';
            };

            reader.readAsDataURL(input.files[0]);
        } else {
            previewElement.innerHTML = '';
            previewElement.style.display = 'none';
        }
    }

    async submitForm() {
        try {
            // Validate bannerFileOne file count
            if (this.bannerFileOne.files.length > this.maxImagesForBannerOne) {
                this.showError(`Maximum ${this.maxImagesForBannerOne} images allowed for Banner Images Set 1`);
                return;
            }

            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'Saving...';

            const formData = new FormData();

            // Add text data
            const bannerData = {
                pageName: this.pageNameInput.value,
                header: this.headerInput.value,
                text: this.textInput.value
            };

            formData.append('bannerData', new Blob([JSON.stringify(bannerData)], {
                type: 'application/json'
            }));

            // Add multiple files for bannerFileOne
            if (this.bannerFileOne.files && this.bannerFileOne.files.length > 0) {
                Array.from(this.bannerFileOne.files).forEach((file, index) => {
                    formData.append('bannerFileOne', file);
                });
            }

            // Add single files for other banner fields
            if (this.bannerFileTwo.files[0]) {
                formData.append('bannerFileTwo', this.bannerFileTwo.files[0]);
            }
            if (this.bannerFileThree.files[0]) {
                formData.append('bannerFileThree', this.bannerFileThree.files[0]);
            }
            if (this.bannerFileFour.files[0]) {
                formData.append('bannerFileFour', this.bannerFileFour.files[0]);
            }

            let url, method;

            if (this.currentEditId) {
                // Edit mode
                url = `${this.baseUrl}/edit-banner/${this.currentEditId}`;
                method = 'PATCH';
            } else {
                // Add mode
                url = `${this.baseUrl}/create-banner`;
                method = 'POST';
            }

            const response = await fetch(url, {
                method: method,
                body: formData,
                // Don't set Content-Type header manually - let browser set it with boundary
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to save banner');
            }

            const responseData = await response.json();
            this.showSuccess(this.currentEditId ? 'Banner updated successfully!' : 'Banner created successfully!');
            this.closeModals();
            await this.loadBanners();

        } catch (error) {
            console.error('Error saving banner:', error);
            this.showError(error.message || 'Failed to save banner. Please try again.');
        } finally {
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = this.currentEditId ? 'Update Banner' : 'Create Banner';
        }
    }

    editBanner(bannerId) {
        this.openModal('edit', bannerId);
    }

    confirmDelete(bannerId) {
        this.currentEditId = bannerId;
        this.deleteModal.style.display = 'block';
    }

    async deleteBanner() {
        try {
            this.confirmDeleteBtn.disabled = true;
            this.confirmDeleteBtn.textContent = 'Deleting...';

            const response = await fetch(`${this.baseUrl}/delete-banner-page/${this.currentEditId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete banner');
            }

            this.showSuccess('Banner deleted successfully!');
            this.closeModals();
            await this.loadBanners();

        } catch (error) {
            console.error('Error deleting banner:', error);
            this.showError('Failed to delete banner. Please try again.');
        } finally {
            this.confirmDeleteBtn.disabled = false;
            this.confirmDeleteBtn.textContent = 'Delete';
        }
    }

    showLoading(show) {
        if (show) {
            this.loading.style.display = 'flex';
            this.bannerTableBody.style.display = 'none';
        } else {
            this.loading.style.display = 'none';
            this.bannerTableBody.style.display = '';
        }
    }

    showSuccess(message) {
        alert(message); // Replace with a more elegant notification system if needed
    }

    showError(message) {
        alert(message); // Replace with a more elegant notification system if needed
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the BannerManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bannerManager = new BannerManager();
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
 
        function logout() {
            alert('Logging out...');
            // Implement logout logic here
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