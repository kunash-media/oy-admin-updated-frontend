document.addEventListener('DOMContentLoaded', function() {

    // Load admin data when page loads
    loadAdminData();

    // Left nav toggle functionality
    const menuIcon = document.getElementById('menuIcon');
    const leftNav = document.getElementById('leftNav');

    if (menuIcon && leftNav) {
        menuIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            if (leftNav.style.display === 'block') {
                leftNav.style.display = 'none';
            } else {
                leftNav.style.display = 'block';
            }
        });
    }

    // Close left nav when clicking outside
    document.addEventListener('click', function(e) {
        if (leftNav && !e.target.closest('#leftNav') && !e.target.closest('#menuIcon')) {
            leftNav.style.display = 'none';
        }
    });

    // Profile menu toggle
    const profileIcon = document.getElementById('profileIcon');
    const profileMenu = document.getElementById('profileMenu');

    if (profileIcon && profileMenu) {
        profileIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            if (profileMenu.style.display === 'block') {
                profileMenu.style.display = 'none';
            } else {
                profileMenu.style.display = 'block';
            }
        });
    }

    // Close profile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (profileMenu && !e.target.closest('.profile-dropdown')) {
            profileMenu.style.display = 'none';
        }
    });

    // Inventory/Catalog submenu toggle
    const catalogToggle = document.getElementById('catalogToggle');
    const catalogSub = document.getElementById('catalogSub');

    if (catalogToggle && catalogSub) {
        catalogToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (catalogSub.style.display === 'block') {
                catalogSub.style.display = 'none';
                this.classList.remove('fa-chevron-up');
                this.classList.add('fa-chevron-down');
            } else {
                catalogSub.style.display = 'block';
                this.classList.remove('fa-chevron-down');
                this.classList.add('fa-chevron-up');
            }
        });
    }

    // Customers submenu toggle
    const customersToggle = document.getElementById('customersToggle');
    const customersSub = document.getElementById('customersSub');

    if (customersToggle && customersSub) {
        customersToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (customersSub.style.display === 'block') {
                customersSub.style.display = 'none';
                this.classList.remove('fa-chevron-up');
                this.classList.add('fa-chevron-down');
            } else {
                customersSub.style.display = 'block';
                this.classList.remove('fa-chevron-down');
                this.classList.add('fa-chevron-up');
            }
        });
    }

    // Online Store submenu toggle
    const onlineStoreToggle = document.getElementById('onlineStoreToggle');
    const onlineStoreSub = document.getElementById('onlineStoreSub');

    if (onlineStoreToggle && onlineStoreSub) {
        onlineStoreToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (onlineStoreSub.style.display === 'block') {
                onlineStoreSub.style.display = 'none';
                this.classList.remove('fa-chevron-up');
                this.classList.add('fa-chevron-down');
            } else {
                onlineStoreSub.style.display = 'block';
                this.classList.remove('fa-chevron-down');
                this.classList.add('fa-chevron-up');
            }
        });
    }

    // Store Customization submenu toggle
    const storeCustomizationToggle = document.getElementById('storeCustomizationToggle');
    const storeCustomizationSub = document.getElementById('storeCustomizationSub');

    if (storeCustomizationToggle && storeCustomizationSub) {
        storeCustomizationToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (storeCustomizationSub.style.display === 'block') {
                storeCustomizationSub.style.display = 'none';
                this.classList.remove('fa-chevron-up');
                this.classList.add('fa-chevron-down');
            } else {
                storeCustomizationSub.style.display = 'block';
                this.classList.remove('fa-chevron-down');
                this.classList.add('fa-chevron-up');
            }
        });
    }

    // Settings submenu toggle
    const settingsToggle = document.getElementById('settingsToggle');
    const settingsSub = document.getElementById('settingsSub');

    if (settingsToggle && settingsSub) {
        settingsToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (settingsSub.style.display === 'block') {
                settingsSub.style.display = 'none';
                this.classList.remove('fa-chevron-up');
                this.classList.add('fa-chevron-down');
            } else {
                settingsSub.style.display = 'block';
                this.classList.remove('fa-chevron-down');
                this.classList.add('fa-chevron-up');
            }
        });
    }

    // Update button functionality with success popup
    const updateBtn = document.getElementById('updateBtn');
    const settingsForm = document.getElementById('settingsForm');

    if (updateBtn && settingsForm) {
        updateBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Simple validation
            const inputs = settingsForm.querySelectorAll('input, select, textarea');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });

            if (isValid) {
                // Show success popup with green tick
                showSuccessPopup();
            } else {
                alert('Please fill in all fields before updating.');
            }
        });
    }

    // Function to show success popup with green tick icon
    function showSuccessPopup() {
        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        // Create popup content
        const popup = document.createElement('div');
        popup.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
        `;

        // Create success icon
        const icon = document.createElement('div');
        icon.innerHTML = '<i class="fas fa-check-circle" style="color: #28a745; font-size: 60px; margin-bottom: 20px;"></i>';

        // Create success message
        const message = document.createElement('h4');
        message.textContent = 'Information Updated Successfully!';
        message.style.cssText = `
            color: #333;
            margin-bottom: 20px;
            font-family: 'Roboto', sans-serif;
        `;

        // Create OK button
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.cssText = `
            background-color: #28a745;
            color: white;
            border: none;
            padding: 10px 30px;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            font-family: 'Roboto', sans-serif;
        `;

        // Add hover effect to OK button
        okButton.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#218838';
        });
        okButton.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#28a745';
        });

        // Close popup when OK is clicked
        okButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });

        // Assemble popup
        popup.appendChild(icon);
        popup.appendChild(message);
        popup.appendChild(okButton);
        overlay.appendChild(popup);

        // Add to page
        document.body.appendChild(overlay);

        // Close popup when clicking outside
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    // Load admin data function (placeholder - replace with your actual data loading logic)
    function loadAdminData() {
        // Add your data loading logic here
        console.log('Loading admin data...');
        // Example: You can populate form fields with saved data here
    }
});