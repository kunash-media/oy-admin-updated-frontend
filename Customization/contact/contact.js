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
            window.location.href = '../../Login/Login.html';
        }, 1500);
    });
}

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