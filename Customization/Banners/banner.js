class BannerManager {
    constructor() {
        this.banners = [];
        this.filteredBanners = [];
        this.currentEditId = null;
        this.baseUrl = 'http://localhost:8080/api/banners';

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
            this.previewImage(e.target, this.previewOne);
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
            <td>${this.renderImageCell(banner.bannerFileOne, 'jpeg')}</td>
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
            this.showExistingImage(this.previewOne, banner.bannerFileOne);
        }
        if (banner.bannerFileTwo) {
            this.showExistingImage(this.previewTwo, banner.bannerFileTwo);
        }
        if (banner.bannerFileThree) {
            this.showExistingImage(this.previewThree, banner.bannerFileThree);
        }
        if (banner.bannerFileFour) {
            this.showExistingImage(this.previewFour, banner.bannerFileFour);
        }
    }

    showExistingImage(previewElement, imageUrl) {
        previewElement.innerHTML = `<img src="${imageUrl}" alt="Current Image">`;
        previewElement.style.display = 'block';
    }

    clearPreviews() {
        [this.previewOne, this.previewTwo, this.previewThree, this.previewFour].forEach(preview => {
            preview.innerHTML = '';
            preview.style.display = 'none';
        });
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

            // Add files if selected
            if (this.bannerFileOne.files[0]) {
                formData.append('bannerFileOne', this.bannerFileOne.files[0]);
            }
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