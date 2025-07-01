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
    // Banner1 Section
    document.getElementById('bannerHeading').value = "Contact Us ";
    document.getElementById('bannerText').value = "We 'd love to hear from you! Reach out with any questions or feedback.";

    // Get In Touch Section - Card 1
    document.getElementById('cardHeading ').value = "Customer Support";
    document.getElementById('cardText1 ').value = "support@example.com";
    document.getElementById('cardText2 ').value = "Mon-Fri: 9AM-5PM";

    // Add second Get In Touch card
    const addCardBtn = document.querySelector('.card .btn-primary ');
    addCardBtn.click();
    const cardInputs = document.querySelectorAll('.card input[type="text" ] ');
    cardInputs[3].value = "Sales Inquiries";
    cardInputs[4].value = "sales@example.com";
    cardInputs[5].value = "24/7 Support";

    // Send Us a Message Section
    document.getElementById('contactName ').value = "Your Name";
    document.getElementById('contactEmail ').value = "your.email@example.com";
    document.getElementById('contactPhone ').value = "+1 (555) 123-4567";
    document.getElementById('contactMessage ').value = "How can we help you today?";

    // FAQ Section
    document.getElementById('question1 ').value = "What are your business hours?";
    document.getElementById('answer1 ').value = "Our customer support team is available Monday through Friday from 9:00 AM to 5:00 PM EST.";

    // Add second FAQ item
    const addFaqBtn = document.querySelectorAll('.card .btn-primary ')[1];
    addFaqBtn.click();
    const faqInputs = document.querySelectorAll('.card input[type="text" ] ');
    const faqTextareas = document.querySelectorAll('.card textarea ');
    faqInputs[6].value = "How can I track my order?";
    faqTextareas[1].value = "You'll receive a tracking number via email once your order ships. You can use this to track your package on our website. ";

    // Footer Section - Shop Links
    addShopLink("All Products ", "/products ");
    addShopLink("New Arrivals ", "/new-arrivals ");
    addShopLink("Best Sellers ", "/bestsellers ");

    // Footer Section - Company Links
    addCompanyLink("About Us ", "/about ");
    addCompanyLink("Contact ", "/contact ");
    addCompanyLink("Careers ", "/careers ");

    // Footer Section - Legal Links
    addLegalLink("Privacy Policy ", "/privacy ");
    addLegalLink("Terms of Service ", "/terms ");

    // Footer Section - Social Icons
    addSocialIcon("https://facebook.com/example ");
    addSocialIcon("https://instagram.com/example ");
    addSocialIcon("https://twitter.com/example ");

    // Footer Section - Below Footer
    document.querySelector('.card-body textarea[rows="2 "]').value = "© 2025 Kunash Media. All rights reserved. ";
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
        <div class="col-md-5 ">
            <input type="text " class="form-control mb-2 " placeholder="Text${count} ">
        </div>
        <div class="col-md-5 ">
            <input type="url " class="form-control mb-2 " placeholder="URL${count} ">
        </div>
        <div class="col-md-2 ">
            <button class="btn btn-danger " onclick="this.parentElement.parentElement.remove() ">Remove</button>
        </div>
    `;

    container.appendChild(newFieldGroup);
}

// Call the function when DOM is fully loaded
document.addEventListener('DOMContentLoaded', populateDummyData);