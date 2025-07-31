// Navigation functions
        function toggleLeftNav() {
            const leftNav = document.getElementById('leftNavbar');
            const mainContent = document.getElementById('mainContent');
           
            leftNav.classList.toggle('open');
            // mainContent.classList.toggle('shifted');
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
        // document.addEventListener('click', function(event) {
        //     const leftNav = document.getElementById('leftNavbar');
        //     const menuIcon = document.querySelector('.menu-icon');
        //     const mainContent = document.getElementById('mainContent');
           
        //     if (window.innerWidth <= 768 && leftNav.classList.contains('open') &&
        //         !leftNav.contains(event.target) && !menuIcon.contains(event.target)) {
        //         leftNav.classList.remove('open');
        //         // mainContent.classList.remove('shifted');
        //     }
        // });
 
        // Handle window resize
        // window.addEventListener('resize', function() {
        //     const leftNav = document.getElementById('leftNavbar');
        //     const mainContent = document.getElementById('mainContent');
           
        //     if (window.innerWidth > 768) {
        //         // Reset mobile-specific classes on desktop
        //         if (leftNav.classList.contains('open')) {
        //             mainContent.classList.add('shifted');
        //         }
        //     } else {
        //         // On mobile, remove shifted class
        //         mainContent.classList.remove('shifted');
        //     }
        // });
 
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
            window.location.href = '../../Login/Login.html';
        }, 1500);
    });
}

//--------------- main js ---------------------//

// contact.js

class ContactManager {
    constructor() {
        this.allContacts = [];
        this.filteredContacts = [];
        this.searchTimeout = null;
        this.baseUrl = 'https://api.oyjewells.com/api/contact';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadContacts();
    }

    setupEventListeners() {
        // Search input with 3 letter delay
        const searchInput = document.getElementById('contactSearchInput');
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Clear previous timeout
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            
            // Set new timeout for 3 letter delay (300ms)
            this.searchTimeout = setTimeout(() => {
                this.handleSearch(query);
            }, 300);
        });

        // Close modal events
        const closeBtn = document.getElementById('contactCloseBtn');
        const overlay = document.getElementById('contactOverlay');
        
        closeBtn.addEventListener('click', () => this.closeModal());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    async loadContacts() {
        try {
            this.showLoading(true);
            const response = await fetch(`${this.baseUrl}/get-all-contact-us`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contacts = await response.json();
            this.allContacts = contacts;
            this.filteredContacts = [...contacts];
            this.renderTable();
            
        } catch (error) {
            console.error('Error loading contacts:', error);
            this.showError('Failed to load contacts. Please try again later.');
        } finally {
            this.showLoading(false);
        }
    }

    handleSearch(query) {
        if (query.length === 0) {
            this.filteredContacts = [...this.allContacts];
        } else {
            this.filteredContacts = this.allContacts.filter(contact =>
                contact.name.toLowerCase().includes(query.toLowerCase())
            );
        }
        this.renderTable();
    }

    renderTable() {
        const tableBody = document.getElementById('contactTableBody');
        const noDataDiv = document.getElementById('contactNoData');
        
        if (this.filteredContacts.length === 0) {
            tableBody.innerHTML = '';
            noDataDiv.style.display = 'block';
            return;
        }
        
        noDataDiv.style.display = 'none';
        
        tableBody.innerHTML = this.filteredContacts.map(contact => `
            <tr>
                <td>${contact.formId}</td>
                <td>${this.escapeHtml(contact.name)}</td>
                <td>${this.escapeHtml(contact.email)}</td>
                <td>${this.escapeHtml(contact.phone)}</td>
                <td>
                    <button 
                        class="contact-view-btn" 
                        onclick="contactManager.viewContact(${contact.formId})"
                    >
                        View Form
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async viewContact(formId) {
        try {
            // Show modal first, then show loading
            this.showModal();
            this.showModalLoading(true);
            
            const response = await fetch(`${this.baseUrl}/get-by-formId/${formId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contact = await response.json();
            
            // Restore modal structure and populate with data
            this.showModalLoading(false);
            this.populateModal(contact);
            
        } catch (error) {
            console.error('Error loading contact details:', error);
            this.closeModal();
            alert('Failed to load contact details. Please try again.');
        }
    }

    populateModal(contact) {
        document.getElementById('modalFormId').textContent = contact.formId || 'N/A';
        document.getElementById('modalName').textContent = contact.name || 'N/A';
        document.getElementById('modalEmail').textContent = contact.email || 'N/A';
        document.getElementById('modalPhone').textContent = contact.phone || 'N/A';
        document.getElementById('modalMessage').textContent = contact.message || 'No message provided';
    }

    showModal() {
        const overlay = document.getElementById('contactOverlay');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const overlay = document.getElementById('contactOverlay');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    showLoading(show) {
        const loading = document.getElementById('contactLoading');
        const tableWrapper = document.querySelector('.contact-table-wrapper');
        
        if (show) {
            loading.style.display = 'block';
            tableWrapper.style.display = 'none';
        } else {
            loading.style.display = 'none';
            tableWrapper.style.display = 'block';
        }
    }

    showModalLoading(show) {
        const modalBody = document.querySelector('.contact-modal-body');
        
        if (show) {
            modalBody.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div class="contact-loader"></div>
                    <p>Loading contact details...</p>
                </div>
            `;
        } else {
            // Restore the original modal structure
            modalBody.innerHTML = `
                <div class="contact-form-field">
                    <label>Form ID:</label>
                    <span id="modalFormId"></span>
                </div>
                <div class="contact-form-field">
                    <label>Name:</label>
                    <span id="modalName"></span>
                </div>
                <div class="contact-form-field">
                    <label>Email:</label>
                    <span id="modalEmail"></span>
                </div>
                <div class="contact-form-field">
                    <label>Phone:</label>
                    <span id="modalPhone"></span>
                </div>
                <div class="contact-form-field">
                    <label>Message:</label>
                    <span id="modalMessage" class="contact-message-text"></span>
                </div>
            `;
        }
    }

    showError(message) {
        const container = document.querySelector('.contact-container');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'contact-error-message';
        errorDiv.style.cssText = `
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
            text-align: center;
        `;
        errorDiv.textContent = message;
        
        // Remove any existing error messages
        const existingError = container.querySelector('.contact-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        container.appendChild(errorDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    // Method to refresh data (can be called externally)
    refresh() {
        this.loadContacts();
    }
}

// Initialize the contact manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contactManager = new ContactManager();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactManager;
}