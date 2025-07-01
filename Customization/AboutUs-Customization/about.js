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

// Function to populate all fields with dummy data
function populateDummyData() {
    // Banner Section
    document.getElementById('bannerHeading').value = "About Kunash Media";
    document.getElementById('bannerText').value = "Discover our story, our values, and the passionate team behind our brand";

    // Who We Are Section
    document.getElementById('whoWeAre').value = "Kunash Media is a leading e-commerce platform founded in 2015 with a mission to provide high-quality products with exceptional customer service. We believe in sustainable business practices and building long-term relationships with our customers. Our team of experts carefully curates each product in our collection to ensure quality and value.";

    // Our Approach Section
    document.getElementById('approachCount').value = "1500+";
    document.getElementById('approachText').value = "Happy customers served since our inception. We take pride in our customer-first approach and commitment to excellence in every interaction.";

    // Meet the Team Section
    document.getElementById('teamMemberName').value = "Pranjal Prasad";
    document.getElementById('teamMemberPosition').value = "Founder & CEO";
    document.getElementById('teamMemberDescription').value = "With over 10 years of experience in the e-commerce industry, Pranjal founded Kunash Media with a vision to create a customer-centric shopping experience. His leadership has guided the company to become an industry leader.";

    // Footer Section - Shop Links
    addShopLink("All Products", "/products");
    addShopLink("New Arrivals", "/new-arrivals");
    addShopLink("Best Sellers", "/bestsellers");

    // Footer Section - Company Links
    addCompanyLink("About Us", "/about");
    addCompanyLink("Contact", "/contact");
    addCompanyLink("Careers", "/careers");

    // Footer Section - Legal Links
    addLegalLink("Privacy Policy", "/privacy");
    addLegalLink("Terms of Service", "/terms");

    // Footer Section - Social Icons
    addSocialIcon("https://facebook.com/kunashmedia");
    addSocialIcon("https://instagram.com/kunashmedia");
    addSocialIcon("https://twitter.com/kunashmedia");

    // Footer Section - Below Footer
    document.querySelector('.card-body textarea[rows="2"]').value = "© 2025 Kunash Media. All rights reserved. Committed to excellence in e-commerce.";
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

// Call the function when DOM is fully loaded
document.addEventListener('DOMContentLoaded', populateDummyData);