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

    // Load FAQs from backend on page load
    loadFAQsFromBackend();
});

// Backend API configuration
const API_BASE_URL = 'http://localhost:8080/api/faq'; // Update this with your actual backend URL

// Utility function to show loading state
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    const loadingDiv = document.createElement('div');
    loadingDiv.id = `${containerId}-loading`;
    loadingDiv.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
    container.appendChild(loadingDiv);
}

// Utility function to hide loading state
function hideLoading(containerId) {
    const loading = document.getElementById(`${containerId}-loading`);
    if (loading) {
        loading.remove();
    }
}

// Function to show error message
function showError(message, containerId) {
    const container = document.getElementById(containerId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
        <strong>Error!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    container.insertBefore(errorDiv, container.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Function to show success message
function showSuccess(message, containerId) {
    const container = document.getElementById(containerId);
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success alert-dismissible fade show';
    successDiv.innerHTML = `
        <strong>Success!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    container.insertBefore(successDiv, container.firstChild);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 3000);
}

// Function to load FAQs from backend
async function loadFAQsFromBackend() {
    try {
        showLoading('faqContainer');

        const response = await fetch(`${API_BASE_URL}/get-All-Active-FAQs`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const faqs = await response.json();
        hideLoading('faqContainer');

        if (faqs && faqs.length > 0) {
            populateFAQsFromBackend(faqs);
        } else {
            // If no FAQs found, use dummy data
            populateDummyData();
        }

    } catch (error) {
        hideLoading('faqContainer');
        console.error('Error loading FAQs:', error);
        showError('Failed to load FAQs from server. Loading dummy data instead.', 'faqContainer');
        populateDummyData();
    }
}

// Function to populate FAQs from backend data
function populateFAQsFromBackend(faqs) {
    const faqContainer = document.getElementById('faqContainer');

    // Clear existing FAQ items
    faqContainer.innerHTML = '';

    faqs.forEach((faq, index) => {
        const newItem = document.createElement('div');
        newItem.className = 'faq-item mb-4';
        newItem.setAttribute('data-faq-id', faq.id);
        newItem.innerHTML = `
            <div class="mb-3">
                <label class="form-label">Question ${index + 1}</label>
                <input type="text" class="form-control faq-question" placeholder="Enter question" value="${faq.question || ''}">
            </div>
            <div class="mb-3">
                <label class="form-label">Answer ${index + 1}</label>
                <textarea class="form-control faq-answer" rows="3" placeholder="Enter answer">${faq.answer || ''}</textarea>
            </div>
            <div class="mb-3">
                <label class="form-label">Category</label>
                <input type="text" class="form-control faq-category" placeholder="Enter category" value="${faq.category || ''}">
            </div>
            <div class="mb-3">
                <button type="button" class="btn btn-primary btn-sm me-2" onclick="updateFAQ(${faq.id})">Update</button>
                <button type="button" class="btn btn-danger btn-sm me-2" onclick="deleteFAQ(${faq.id})">Delete</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="toggleFAQStatus(${faq.id})">${faq.active ? 'Deactivate' : 'Activate'}</button>
            </div>
        `;

        faqContainer.appendChild(newItem);
    });
}

// Function to save all FAQs to backend
async function saveAllFAQsToBackend() {
    const faqContainer = document.getElementById('faqContainer');
    const faqItems = faqContainer.querySelectorAll('.faq-item');

    try {
        showLoading('faqContainer');

        for (let item of faqItems) {
            const faqId = item.getAttribute('data-faq-id');
            const question = item.querySelector('.faq-question').value;
            const answer = item.querySelector('.faq-answer').value;
            const category = item.querySelector('.faq-category').value || 'General';

            const faqData = {
                question: question,
                answer: answer,
                category: category,
                active: true
            };

            if (faqId && faqId !== 'null') {
                // Update existing FAQ
                await updateFAQInBackend(faqId, faqData);
            } else {
                // Create new FAQ
                const newFAQ = await createFAQInBackend(faqData);
                if (newFAQ) {
                    item.setAttribute('data-faq-id', newFAQ.id);
                }
            }
        }

        hideLoading('faqContainer');
        showSuccess('All FAQs saved successfully!', 'faqContainer');

    } catch (error) {
        hideLoading('faqContainer');
        console.error('Error saving FAQs:', error);
        showError('Failed to save FAQs. Please try again.', 'faqContainer');
    }
}

// Function to create FAQ in backend
async function createFAQInBackend(faqData) {
    try {
        const response = await fetch(`${API_BASE_URL}/create-FAQ`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(faqData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating FAQ:', error);
        throw error;
    }
}

// Function to update FAQ in backend
async function updateFAQInBackend(id, faqData) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(faqData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating FAQ:', error);
        throw error;
    }
}

// Function to update single FAQ
async function updateFAQ(id) {
    const faqItem = document.querySelector(`[data-faq-id="${id}"]`);
    if (!faqItem) return;

    const question = faqItem.querySelector('.faq-question').value;
    const answer = faqItem.querySelector('.faq-answer').value;
    const category = faqItem.querySelector('.faq-category').value || 'General';

    const faqData = {
        question: question,
        answer: answer,
        category: category,
        active: true
    };

    try {
        await updateFAQInBackend(id, faqData);
        showSuccess('FAQ updated successfully!', 'faqContainer');
    } catch (error) {
        showError('Failed to update FAQ. Please try again.', 'faqContainer');
    }
}

// Function to delete FAQ
async function deleteFAQ(id) {
    if (!confirm('Are you sure you want to delete this FAQ?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove from DOM
        const faqItem = document.querySelector(`[data-faq-id="${id}"]`);
        if (faqItem) {
            faqItem.remove();
        }

        showSuccess('FAQ deleted successfully!', 'faqContainer');

    } catch (error) {
        console.error('Error deleting FAQ:', error);
        showError('Failed to delete FAQ. Please try again.', 'faqContainer');
    }
}

// Function to toggle FAQ status
async function toggleFAQStatus(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}/toggle-status`, {
            method: 'PUT'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedFAQ = await response.json();

        // Update button text
        const faqItem = document.querySelector(`[data-faq-id="${id}"]`);
        if (faqItem) {
            const toggleBtn = faqItem.querySelector('.btn-secondary');
            toggleBtn.textContent = updatedFAQ.active ? 'Deactivate' : 'Activate';
        }

        showSuccess(`FAQ ${updatedFAQ.active ? 'activated' : 'deactivated'} successfully!`, 'faqContainer');

    } catch (error) {
        console.error('Error toggling FAQ status:', error);
        showError('Failed to toggle FAQ status. Please try again.', 'faqContainer');
    }
}

// Function to search FAQs
async function searchFAQs(keyword) {
    if (!keyword.trim()) {
        loadFAQsFromBackend();
        return;
    }

    try {
        showLoading('faqContainer');

        const response = await fetch(`${API_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const faqs = await response.json();
        hideLoading('faqContainer');

        populateFAQsFromBackend(faqs);

    } catch (error) {
        hideLoading('faqContainer');
        console.error('Error searching FAQs:', error);
        showError('Failed to search FAQs. Please try again.', 'faqContainer');
    }
}

// Function to load FAQs by category
async function loadFAQsByCategory(category) {
    try {
        showLoading('faqContainer');

        const response = await fetch(`${API_BASE_URL}/category/${encodeURIComponent(category)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const faqs = await response.json();
        hideLoading('faqContainer');

        populateFAQsFromBackend(faqs);

    } catch (error) {
        hideLoading('faqContainer');
        console.error('Error loading FAQs by category:', error);
        showError('Failed to load FAQs by category. Please try again.', 'faqContainer');
    }
}

// Function to load all categories
async function loadAllCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const categories = await response.json();
        return categories;

    } catch (error) {
        console.error('Error loading categories:', error);
        return [];
    }
}

// Function to open overlay
function openOverlay(id) {
    document.getElementById(id).style.display = 'flex';
}

// Function to close overlay
function closeOverlay(id) {
    document.getElementById(id).style.display = 'none';
}

// Function to add FAQ item (enhanced with backend connectivity)
function addFaqItem() {
    const container = document.getElementById('faqContainer');
    const count = container.children.length + 1;

    const newItem = document.createElement('div');
    newItem.className = 'faq-item mb-4';
    newItem.setAttribute('data-faq-id', 'null'); // Mark as new item
    newItem.innerHTML = `
        <div class="mb-3">
            <label class="form-label">Question ${count}</label>
            <input type="text" class="form-control faq-question" placeholder="Enter question">
        </div>
        <div class="mb-3">
            <label class="form-label">Answer ${count}</label>
            <textarea class="form-control faq-answer" rows="3" placeholder="Enter answer"></textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">Category</label>
            <input type="text" class="form-control faq-category" placeholder="Enter category" value="General">
        </div>
        <div class="mb-3">
            <button type="button" class="btn btn-success btn-sm me-2" onclick="saveSingleFAQ(this)">Save</button>
            <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeFAQItem(this)">Remove</button>
        </div>
    `;

    container.appendChild(newItem);
}

// Function to save single FAQ item
async function saveSingleFAQ(button) {
    const faqItem = button.closest('.faq-item');
    const question = faqItem.querySelector('.faq-question').value;
    const answer = faqItem.querySelector('.faq-answer').value;
    const category = faqItem.querySelector('.faq-category').value;

    if (!question.trim() || !answer.trim()) {
        showError('Please fill in both question and answer fields.', 'faqContainer');
        return;
    }

    const faqData = {
        question: question,
        answer: answer,
        category: category || 'General',
        active: true
    };

    try {
        const newFAQ = await createFAQInBackend(faqData);
        if (newFAQ) {
            faqItem.setAttribute('data-faq-id', newFAQ.id);

            // Update buttons
            const buttonContainer = faqItem.querySelector('.mb-3:last-child');
            buttonContainer.innerHTML = `
                <button type="button" class="btn btn-primary btn-sm me-2" onclick="updateFAQ(${newFAQ.id})">Update</button>
                <button type="button" class="btn btn-danger btn-sm me-2" onclick="deleteFAQ(${newFAQ.id})">Delete</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="toggleFAQStatus(${newFAQ.id})">Deactivate</button>
            `;

            showSuccess('FAQ saved successfully!', 'faqContainer');
        }
    } catch (error) {
        showError('Failed to save FAQ. Please try again.', 'faqContainer');
    }
}

// Function to remove FAQ item from DOM (for unsaved items)
function removeFAQItem(button) {
    const faqItem = button.closest('.faq-item');
    faqItem.remove();
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

// Function to populate all fields with dummy data (preserved original functionality)
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

    // Clear existing items
    faqContainer.innerHTML = '';

    faqItems.forEach((item, index) => {
        if (index > 0) addFaqItem();
        else {
            // Add first item
            addFaqItem();
        }
        const lastItem = faqContainer.children[faqContainer.children.length - 1];
        const inputs = lastItem.getElementsByTagName('input');
        const textareas = lastItem.getElementsByTagName('textarea');
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