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