document.addEventListener('DOMContentLoaded', function() {
    // Toggle left navigation
    document.getElementById('menuIcon').addEventListener('click', function() {
        const leftNav = document.getElementById('leftNav');
        leftNav.style.display = leftNav.style.display === 'block' ? 'none' : 'block';
        document.querySelector('.main-content').classList.toggle('left-nav-active');
    });

    // Profile dropdown toggle
    document.getElementById('profileIcon').addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent the click from bubbling up
        const menu = document.getElementById('profileMenu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    // Close profile dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.profile-dropdown')) {
            document.getElementById('profileMenu').style.display = 'none';
        }
    });

    // Toggle submenus in left navigation
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
});

function addLinkField(containerId) {
    const container = document.getElementById(containerId);
    const newFieldGroup = document.createElement('div');
    newFieldGroup.className = 'row mb-2';

    const count = container.getElementsByClassName('row').length + 1;

    newFieldGroup.innerHTML = `
        <div class="col-md-5">
            <input type="text" class="form-control mb-2" placeholder="Text${count}">
        </div>
        <div class="col-md-5">
            <input type="url" class="form-control mb-2" placeholder="URL${count}">
        </div>
        <div class="col-md-2">
            <button class="btn btn-danger" onclick="this.parentElement.parentElement.remove()">Remove</button>
        </div>
    `;

    container.appendChild(newFieldGroup);
}

// Function to add product features
function addFeature() {
    const container = document.getElementById('productFeatures');
    const newFeatureGroup = document.createElement('div');
    newFeatureGroup.className = 'row mb-2';

    const count = container.getElementsByClassName('row').length + 1;

    newFeatureGroup.innerHTML = `
        <div class="col-md-10">
            <input type="text" class="form-control" placeholder="Feature ${count}">
        </div>
        <div class="col-md-2">
            <button type="button" class="btn btn-danger" onclick="this.parentElement.parentElement.remove()">Remove</button>
        </div>
    `;

    container.appendChild(newFeatureGroup);
}

// Function to handle category dropdown change
function handleCategoryChange() {
    const categorySelect = document.getElementById('productCategory');
    const customCategoryDiv = document.getElementById('customCategoryDiv');

    if (categorySelect.value === 'other') {
        customCategoryDiv.style.display = 'block';
    } else {
        customCategoryDiv.style.display = 'none';
    }
}

// Function to add custom category to dropdown
function addCustomCategory() {
    const customCategoryInput = document.getElementById('customCategory');
    const categorySelect = document.getElementById('productCategory');

    if (customCategoryInput.value.trim() !== '') {
        // Create new option
        const newOption = document.createElement('option');
        newOption.value = customCategoryInput.value.toLowerCase().replace(/\s+/g, '-');
        newOption.textContent = customCategoryInput.value;

        // Insert before "Other" option
        const otherOption = categorySelect.querySelector('option[value="other"]');
        categorySelect.insertBefore(newOption, otherOption);

        // Select the new option
        categorySelect.value = newOption.value;

        // Clear input and hide div
        customCategoryInput.value = '';
        document.getElementById('customCategoryDiv').style.display = 'none';
    }
}

// Function to populate dummy data for all fields
function populateDummyData() {
    // Banner Section
    document.querySelector('.card-body input[type="text"]').value = "Summer Collection 2025";
    document.querySelector('.card-body textarea').value = "Discover our exclusive summer collection with up to 40% off on selected items. Limited time offer!";

    // Product Details
    document.getElementById('productTitle').value = "Elegant Diamond Necklace";
    document.getElementById('productPrice').value = "299.99";
    document.getElementById('productOldPrice').value = "399.99";
    document.getElementById('productDescription').value = "This stunning diamond necklace features premium quality diamonds set in 18k gold. Perfect for special occasions and everyday elegance.";
    document.getElementById('productQuantity').value = "50";
    document.getElementById('shopBy').value = "Occasion";
    document.getElementById('productDiscount').value = "25";
    document.getElementById('productCouponCode').value = "SAVE25";

    // Sticky Notes Section
    document.querySelectorAll('.card-body textarea')[1].value = "Featured Product:\n- 100% Organic Cotton\n- Available in 5 colors\n- Free shipping on orders over $50";

    // Banner 3 Section
    const banner3Inputs = document.querySelectorAll('.card-body input[type="text"]');
    banner3Inputs[1].value = "Winter Essentials";
    document.querySelectorAll('.card-body textarea')[2].value = "Get ready for winter with our warmest collection yet. New arrivals every week!";

    // Footer Section - Shop Links
    addShopLink("All Products", "/products");
    addShopLink("New Arrivals", "/new");
    addShopLink("Best Sellers", "/bestsellers");

    // Footer Section - Company Links
    addCompanyLink("About Us", "/about");
    addCompanyLink("Contact", "/contact");
    addCompanyLink("Careers", "/careers");

    // Footer Section - Legal Links
    addLegalLink("Privacy Policy", "/privacy");
    addLegalLink("Terms of Service", "/terms");

    // Footer Section - Social Icons
    addSocialIcon("https://facebook.com/example");
    addSocialIcon("https://instagram.com/example");

    // Footer Section - Below Footer
    document.querySelector('.card-body textarea[rows="2"]').value = "© 2025 Kunash Media. All rights reserved.";
}

// Helper functions for adding multiple links
function addShopLink(text, url) {
    addLinkField('shopLinks');
    const container = document.getElementById('shopLinks');
    const inputs = container.getElementsByTagName('input');
    inputs[inputs.length - 2].value = text;
    inputs[inputs.length - 1].value = url;
}

function addCompanyLink(text, url) {
    addLinkField('companyLinks');
    const container = document.getElementById('companyLinks');
    const inputs = container.getElementsByTagName('input');
    inputs[inputs.length - 2].value = text;
    inputs[inputs.length - 1].value = url;
}

function addLegalLink(text, url) {
    addLinkField('legalLinks');
    const container = document.getElementById('legalLinks');
    const inputs = container.getElementsByTagName('input');
    inputs[inputs.length - 2].value = text;
    inputs[inputs.length - 1].value = url;
}

function addSocialIcon(url) {
    addLinkField('socialIcons');
    const container = document.getElementById('socialIcons');
    const inputs = container.getElementsByTagName('input');
    inputs[inputs.length - 1].value = url;
}

// Call the function when DOM is fully loaded
document.addEventListener('DOMContentLoaded', populateDummyData);