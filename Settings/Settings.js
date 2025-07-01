document.addEventListener('DOMContentLoaded', function() {
        const updateBtn = document.getElementById('updateBtn');
        const settingsForm = document.getElementById('settingsForm');
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
                alert('Your data has been updated successfully!');
            } else {
                alert('Please fill in all fields before updating.');
            }
        });
        // Left nav toggle
        document.getElementById('menuIcon').addEventListener('click', function() {
            const leftNav = document.getElementById('leftNav');
            leftNav.style.display = leftNav.style.display === 'block' ? 'none' : 'block';
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
    }

);