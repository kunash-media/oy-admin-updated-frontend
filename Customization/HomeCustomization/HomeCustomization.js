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

    // Customization navigation
    const navItems = document.querySelectorAll('.customization-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });

            // Add active class to clicked item
            this.classList.add('active');

            // Hide all content sections
            document.querySelectorAll('.customization-content').forEach(content => {
                content.classList.remove('active');
            });

            // Show the corresponding content section
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Collection navigation
    const collectionNavBtns = document.querySelectorAll('.collection-nav-btn');
    collectionNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            collectionNavBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Hide all sections in the same collection container
            const collectionContainer = this.closest('.customization-content');
            if (collectionContainer) {
                collectionContainer.querySelectorAll('.collection-section').forEach(section => {
                    section.style.display = 'none';
                });

                // Show the selected section
                const targetId = this.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.style.display = 'block';
                }
            }
        });
    });

    // Initialize the first collection section as visible in each collection container
    document.querySelectorAll('.customization-content').forEach(container => {
        if (container.querySelector('.collection-nav')) {
            const firstBtn = container.querySelector('.collection-nav-btn');
            if (firstBtn) {
                firstBtn.click(); // Simulate click on first button
            }
        }
    });

    // Update button functionality
    document.getElementById('updateBtn').addEventListener('click', function() {
        // Show success modal
        var successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    });
});

// Link addition functionality
document.getElementById('addLinkBtn').addEventListener('click', function() {
    const text = document.getElementById('linkText').value;
    const url = document.getElementById('linkUrl').value;

    if (text && url) {
        const linkId = 'link-' + Date.now();
        const linkHtml = `
            <div class="d-flex justify-content-between align-items-center mb-2 p-2 border rounded " id="${linkId} ">
                <div>
                    <span class="fw-bold ">${text}:</span> 
                    <a href="${url} " target="_blank ">${url}</a>
                </div>
                <button class="btn btn-sm btn-danger remove-link " data-link="${linkId} ">
                    <i class="fas fa-times "></i>
                </button>
            </div>
        `;
        document.getElementById('addedLinks').insertAdjacentHTML('beforeend', linkHtml);

        // Clear inputs
        document.getElementById('linkText').value = '';
        document.getElementById('linkUrl').value = '';
    }
});

// Handle link removal
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-link') || e.target.closest('.remove-link')) {
        const linkId = e.target.getAttribute('data-link') ||
            e.target.closest('.remove-link').getAttribute('data-link');
        document.getElementById(linkId).remove();
    }
});

// Footer Settings Functionality
document.getElementById('addShopLinkBtn').addEventListener('click', function() {
    const newLink = document.createElement('div');
    newLink.className = 'row mb-3 shop-link-item';
    newLink.innerHTML = `
        <div class="col-md-6 ">
            <input type="text " class="form-control " placeholder="Text ">
        </div>
        <div class="col-md-6 ">
            <input type="url " class="form-control " placeholder="Link ">
        </div>
    `;
    document.getElementById('shopLinksContainer').appendChild(newLink);
});

document.getElementById('addCompanyLinkBtn').addEventListener('click', function() {
    const newLink = document.createElement('div');
    newLink.className = 'row mb-3 company-link-item';
    newLink.innerHTML = `
        <div class="col-md-6 ">
            <input type="text " class="form-control " placeholder="Text ">
        </div>
        <div class="col-md-6 ">
            <input type="url " class="form-control " placeholder="Link ">
        </div>
    `;
    document.getElementById('companyLinksContainer').appendChild(newLink);
});

document.getElementById('addLegalLinkBtn').addEventListener('click', function() {
    const newLink = document.createElement('div');
    newLink.className = 'row mb-3 legal-link-item';
    newLink.innerHTML = `
        <div class="col-md-6 ">
            <input type="text " class="form-control " placeholder="Text ">
        </div>
        <div class="col-md-6 ">
            <input type="url " class="form-control " placeholder="Link ">
        </div>
    `;
    document.getElementById('legalLinksContainer').appendChild(newLink);
});

document.getElementById('addFollowLinkBtn').addEventListener('click', function() {
    const followContainer = document.querySelector('.card-body');
    const newFollow = document.createElement('div');
    newFollow.className = 'mb-3';
    newFollow.innerHTML = `
        <div class="input-group ">
            <select class="form-select " style="max-width: 120px; ">
                <option value="facebook ">Facebook</option>
                <option value="instagram ">Instagram</option>
                <option value="twitter ">Twitter</option>
                <option value="linkedin ">LinkedIn</option>
                <option value="youtube ">YouTube</option>
                <option value="pinterest ">Pinterest</option>
            </select>
            <input type="url " class="form-control " placeholder="Enter URL ">
        </div>
    `;
    followContainer.insertBefore(newFollow, document.getElementById('addFollowLinkBtn'));
});

document.getElementById('addFooterTextBtn').addEventListener('click', function() {
    const text = document.getElementById('footerText').value;
    if (text) {
        alert(`Footer text added: ${text}`);
        document.getElementById('footerText').value = '';
    }
});

// Function to populate dummy data automatically
function populateDummyData() {
    // Banner Section 1
    const banner1Heading = document.querySelector('.card-body input[type="text "][placeholder="Enter banner heading "]');
    const banner1Text = document.querySelector('.card-body textarea[placeholder="Enter banner text "]');
    if (banner1Heading) banner1Heading.value = "Summer Sale Collection ";
    if (banner1Text) banner1Text.value = "Get up to 50% off on our new summer collection. Limited time offer! ";

    // Card Section
    const cardHeading = document.querySelectorAll('.card-body input[type="text "][placeholder="Enter card heading "]')[0];
    if (cardHeading) cardHeading.value = "New Arrivals ";

    // Banner Section 2
    const banner2Heading = document.querySelectorAll('.card-body input[type="text "][placeholder="Enter banner heading "]')[1];
    const banner2Text = document.querySelectorAll('.card-body textarea[placeholder="Enter banner text "]')[1];
    if (banner2Heading) banner2Heading.value = "Winter Essentials ";
    if (banner2Text) banner2Text.value = "Stay warm this winter with our premium collection of jackets and sweaters. ";

    // Featured Products
    const stickyNotes = document.querySelector('.card-body textarea[placeholder="Enter sticky notes "]');
    if (stickyNotes) stickyNotes.value = "Check out our featured products this week! ";

    // Links Section
    const linkText = document.getElementById('linkText');
    const linkUrl = document.getElementById('linkUrl');
    if (linkText) linkText.value = "About Us ";
    if (linkUrl) linkUrl.value = "https://example.com/about ";

    // Add the link to display it in the addedLinks section
    if (linkText && linkUrl) {
        const linkId = 'link-' + Date.now();
        const linkHtml = `
            <div class="d-flex justify-content-between align-items-center mb-2 p-2 border rounded " id="${linkId} ">
                <div>
                    <span class="fw-bold ">${linkText.value}:</span> 
                    <a href="${linkUrl.value} " target="_blank ">${linkUrl.value}</a>
                </div>
                <button class="btn btn-sm btn-danger remove-link " data-link="${linkId} ">
                    <i class="fas fa-times "></i>
                </button>
            </div>
        `;
        if (document.getElementById('addedLinks')) {
            document.getElementById('addedLinks').insertAdjacentHTML('beforeend', linkHtml);
        }
    }

    // Footer Settings
    // Shop Links
    const shopLinks = [{
        text: "All Products ",
        url: "/products "
    }, {
        text: "New Arrivals ",
        url: "/new "
    }, {
        text: "Best Sellers ",
        url: "/bestsellers "
    }];

    // Company Links
    const companyLinks = [{
        text: "About Us ",
        url: "/about "
    }, {
        text: "Contact ",
        url: "/contact "
    }];

    // Legal Links
    const legalLinks = [{
        text: "Privacy Policy ",
        url: "/privacy "
    }, {
        text: "Terms of Service ",
        url: "/terms "
    }];

    // Populate shop links
    const shopContainer = document.getElementById('shopLinksContainer');
    if (shopContainer) {
        shopContainer.innerHTML = '';
        shopLinks.forEach(link => {
            const div = document.createElement('div');
            div.className = 'row mb-3 shop-link-item';
            div.innerHTML = `
                <div class="col-md-6 ">
                    <input type="text " class="form-control " placeholder="Text " value="${link.text} ">
                </div>
                <div class="col-md-6 ">
                    <input type="url " class="form-control " placeholder="Link " value="${link.url} ">
                </div>
            `;
            shopContainer.appendChild(div);
        });
    }

    // Populate company links
    const companyContainer = document.getElementById('companyLinksContainer');
    if (companyContainer) {
        companyContainer.innerHTML = '';
        companyLinks.forEach(link => {
            const div = document.createElement('div');
            div.className = 'row mb-3 company-link-item';
            div.innerHTML = `
                <div class="col-md-6 ">
                    <input type="text " class="form-control " placeholder="Text " value="${link.text} ">
                </div>
                <div class="col-md-6 ">
                    <input type="url " class="form-control " placeholder="Link " value="${link.url} ">
                </div>
            `;
            companyContainer.appendChild(div);
        });
    }

    // Populate legal links
    const legalContainer = document.getElementById('legalLinksContainer');
    if (legalContainer) {
        legalContainer.innerHTML = '';
        legalLinks.forEach(link => {
            const div = document.createElement('div');
            div.className = 'row mb-3 legal-link-item';
            div.innerHTML = `
                <div class="col-md-6 ">
                    <input type="text " class="form-control " placeholder="Text " value="${link.text} ">
                </div>
                <div class="col-md-6 ">
                    <input type="url " class="form-control " placeholder="Link " value="${link.url} ">
                </div>
            `;
            legalContainer.appendChild(div);
        });
    }

    // Follow section
    const followSelects = document.querySelectorAll('.card-body select.form-select');
    const followInputs = document.querySelectorAll('.card-body input[type="url "][placeholder="Enter URL "]');

    if (followSelects.length > 0 && followInputs.length > 0) {
        followSelects[0].value = "facebook ";
        followInputs[0].value = "https://facebook.com/example ";

        // Add a second social media link
        if (document.getElementById('addFollowLinkBtn')) {
            document.getElementById('addFollowLinkBtn').click();
            const secondSelect = document.querySelectorAll('.card-body select.form-select')[1];
            const secondInput = document.querySelectorAll('.card-body input[type="url "][placeholder="Enter URL "]')[1];
            if (secondSelect && secondInput) {
                secondSelect.value = "instagram ";
                secondInput.value = "https://instagram.com/example ";
            }
        }
    }

    // Below Footer
    const footerText = document.getElementById('footerText');
    if (footerText) footerText.value = "© 2025 Your Store Name. All rights reserved. ";
}

// Call the function when DOM is fully loaded
document.addEventListener('DOMContentLoaded', populateDummyData);