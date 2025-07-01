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

// Function to open overlay
function openOverlay(id) {
    document.getElementById(id).style.display = 'flex';
}

// Function to close overlay
function closeOverlay(id) {
    document.getElementById(id).style.display = 'none';
}

// Function to add FAQ item
function addFaqItem() {
    const container = document.getElementById('faqContainer');
    const count = container.children.length + 1;

    const newItem = document.createElement('div');
    newItem.className = 'faq-item mb-4';
    newItem.innerHTML = `
            <div class="mb-3">
                <label class="form-label">Question ${count}</label>
                <input type="text" class="form-control" placeholder="Enter question">
            </div>
            <div class="mb-3">
                <label class="form-label">Answer ${count}</label>
                <textarea class="form-control" rows="3" placeholder="Enter answer"></textarea>
            </div>
        `;

    container.appendChild(newItem);
}

// Function to add Shipping item
function addShippingItem() {
    const container = document.getElementById('shippingContainer');
    const count = container.children.length + 1;

    const newItem = document.createElement('div');
    newItem.className = 'shipping-item mb-4';
    newItem.innerHTML = `
            <div class="mb-3">
                <label class="form-label">Heading</label>
                <input type="text" class="form-control" placeholder="Enter heading">
            </div>
            <div class="mb-3">
                <label class="form-label">Content</label>
                <textarea class="form-control" rows="3" placeholder="Enter content"></textarea>
            </div>
        `;

    container.appendChild(newItem);
}

// Function to add Cancellation item
function addCancellationItem() {
    const container = document.getElementById('cancellationContainer');
    const count = container.children.length + 1;

    const newItem = document.createElement('div');
    newItem.className = 'cancellation-item mb-4';
    newItem.innerHTML = `
            <div class="mb-3">
                <label class="form-label">Heading</label>
                <input type="text" class="form-control" placeholder="Enter heading">
            </div>
            <div class="mb-3">
                <label class="form-label">Content</label>
                <textarea class="form-control" rows="3" placeholder="Enter content"></textarea>
            </div>
        `;

    container.appendChild(newItem);
}

// Function to add Disclaimer Q&A item
function addDisclaimerQnaItem() {
    const container = document.getElementById('disclaimerQnaContainer');
    const count = container.children.length + 1;

    const newItem = document.createElement('div');
    newItem.className = 'disclaimer-qna-item mb-4';
    newItem.innerHTML = `
            <div class="mb-3">
                <label class="form-label">Question</label>
                <input type="text" class="form-control" placeholder="Enter question">
            </div>
            <div class="mb-3">
                <label class="form-label">Answer</label>
                <textarea class="form-control" rows="3" placeholder="Enter answer"></textarea>
            </div>
        `;

    container.appendChild(newItem);
}

// Function to add Disclaimer Text item
function addDisclaimerTextItem() {
    const container = document.getElementById('disclaimerTextContainer');
    const count = container.children.length + 1;

    const newItem = document.createElement('div');
    newItem.className = 'disclaimer-text-item mb-4';
    newItem.innerHTML = `
            <div class="mb-3">
                <label class="form-label">Text Heading</label>
                <input type="text" class="form-control" placeholder="Enter heading">
            </div>
            <div class="mb-3">
                <label class="form-label">Text Content</label>
                <textarea class="form-control" rows="3" placeholder="Enter content"></textarea>
            </div>
        `;

    container.appendChild(newItem);
}

// Function to populate all fields with dummy data
function populateDummyData() {
    // FAQ Section
    const faqContainer = document.getElementById('faqContainer');
    const faqItems = [{
        question: "How do I track my order?",
        answer: "You can track your order by logging into your account and checking the order status page. Tracking information is typically available within 24 hours of shipment."
    }, {
        question: "What is your return policy?",
        answer: "We accept returns within 30 days of purchase. Items must be unused and in their original packaging. Please contact our customer service to initiate a return."
    }];

    faqItems.forEach((item, index) => {
        if (index > 0) addFaqItem();
        const inputs = faqContainer.children[index].getElementsByTagName('input');
        const textareas = faqContainer.children[index].getElementsByTagName('textarea');
        inputs[0].value = item.question;
        textareas[0].value = item.answer;
    });

    // Shipping Details Section
    const shippingContainer = document.getElementById('shippingContainer');
    const shippingItems = [{
        heading: "Domestic Shipping",
        content: "We offer free shipping on all domestic orders over $50. Standard delivery takes 3-5 business days. Express shipping options are available at checkout."
    }, {
        heading: "International Shipping",
        content: "International orders typically take 7-14 business days to arrive. Additional customs fees may apply depending on your country's import regulations."
    }];

    shippingItems.forEach((item, index) => {
        if (index > 0) addShippingItem();
        const inputs = shippingContainer.children[index].getElementsByTagName('input');
        const textareas = shippingContainer.children[index].getElementsByTagName('textarea');
        inputs[0].value = item.heading;
        textareas[0].value = item.content;
    });

    // Cancellation Policy Section
    const cancellationContainer = document.getElementById('cancellationContainer');
    const cancellationItems = [{
        heading: "Order Cancellation",
        content: "You can cancel your order within 24 hours of placing it. After that, cancellations may not be possible if the order has already been processed for shipping."
    }, {
        heading: "Refund Process",
        content: "Refunds for cancelled orders are processed within 5-7 business days. The refund will be issued to your original payment method."
    }];

    cancellationItems.forEach((item, index) => {
        if (index > 0) addCancellationItem();
        const inputs = cancellationContainer.children[index].getElementsByTagName('input');
        const textareas = cancellationContainer.children[index].getElementsByTagName('textarea');
        inputs[0].value = item.heading;
        textareas[0].value = item.content;
    });

    // Disclaimer Q&A Section
    const disclaimerQnaContainer = document.getElementById('disclaimerQnaContainer');
    const disclaimerQnaItems = [{
        question: "Are product descriptions accurate?",
        answer: "We strive to provide accurate product descriptions, but there may be slight variations in color or size due to monitor settings or manufacturing differences."
    }, {
        question: "Is pricing subject to change?",
        answer: "Yes, we reserve the right to adjust prices at any time. However, once you place an order, the price is locked in for that transaction."
    }];

    disclaimerQnaItems.forEach((item, index) => {
        if (index > 0) addDisclaimerQnaItem();
        const inputs = disclaimerQnaContainer.children[index].getElementsByTagName('input');
        const textareas = disclaimerQnaContainer.children[index].getElementsByTagName('textarea');
        inputs[0].value = item.question;
        textareas[0].value = item.answer;
    });

    // Disclaimer Text Section
    const disclaimerTextContainer = document.getElementById('disclaimerTextContainer');
    const disclaimerTextItems = [{
        heading: "Limitation of Liability",
        content: "Our company shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site."
    }, {
        heading: "Product Use",
        content: "Products are intended for personal use only. Commercial use without prior written consent may violate our terms of service."
    }];

    disclaimerTextItems.forEach((item, index) => {
        if (index > 0) addDisclaimerTextItem();
        const inputs = disclaimerTextContainer.children[index].getElementsByTagName('input');
        const textareas = disclaimerTextContainer.children[index].getElementsByTagName('textarea');
        inputs[0].value = item.heading;
        textareas[0].value = item.content;
    });
}

// Call the function when DOM is fully loaded
document.addEventListener('DOMContentLoaded', populateDummyData);