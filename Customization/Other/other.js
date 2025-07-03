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

    // Load FAQs, Shipping, and Cancellation data from backend on page load
    loadFAQsFromBackend();
    loadShippingFromBackend();
    loadCancellationFromBackend();
});

// Backend API configuration
const API_BASE_URL = 'http://localhost:8080/api/faq'; // Update this with your actual backend URL
const SHIPPING_API_BASE_URL = 'http://localhost:8080/api/shipping'; // Shipping API base URL
const CANCELLATION_API_BASE_URL = 'http://localhost:8080/api/cancellation'; // Cancellation API base URL

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

// =============================
// FAQ BACKEND FUNCTIONS (EXISTING)
// =============================

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
            populateDummyFAQData();
        }

    } catch (error) {
        hideLoading('faqContainer');
        console.error('Error loading FAQs:', error);
        showError('Failed to load FAQs from server. Loading dummy data instead.', 'faqContainer');
        populateDummyFAQData();
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

// =============================
// SHIPPING BACKEND FUNCTIONS (EXISTING)
// =============================

// Function to load shipping data from backend
async function loadShippingFromBackend() {
    try {
        showLoading('shippingContainer');

        const response = await fetch(`${SHIPPING_API_BASE_URL}/get-All-Shippings`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const shippings = await response.json();
        hideLoading('shippingContainer');

        if (shippings && shippings.length > 0) {
            populateShippingFromBackend(shippings);
        } else {
            // If no shipping data found, use dummy data
            populateDummyShippingData();
        }

    } catch (error) {
        hideLoading('shippingContainer');
        console.error('Error loading shipping data:', error);
        showError('Failed to load shipping data from server. Loading dummy data instead.', 'shippingContainer');
        populateDummyShippingData();
    }
}

// Function to populate shipping data from backend
function populateShippingFromBackend(shippings) {
    const shippingContainer = document.getElementById('shippingContainer');

    // Clear existing shipping items
    shippingContainer.innerHTML = '';

    shippings.forEach((shipping, index) => {
        const newItem = document.createElement('div');
        newItem.className = 'shipping-item mb-4';
        newItem.setAttribute('data-shipping-id', shipping.id);
        newItem.innerHTML = `
           <div class="mb-3">
               <label class="form-label">Heading</label>
               <input type="text" class="form-control shipping-title" placeholder="Enter heading" value="${shipping.title || ''}">
           </div>
           <div class="mb-3">
               <label class="form-label">Content</label>
               <textarea class="form-control shipping-description" rows="3" placeholder="Enter content">${shipping.description || ''}</textarea>
           </div>
           <div class="mb-3">
               <button type="button" class="btn btn-primary btn-sm me-2" onclick="updateShipping(${shipping.id})">Update</button>
               <button type="button" class="btn btn-danger btn-sm" onclick="deleteShipping(${shipping.id})">Delete</button>
           </div>
       `;

        shippingContainer.appendChild(newItem);
    });
}

// Function to save all shipping data to backend
async function saveAllShippingToBackend() {
    const shippingContainer = document.getElementById('shippingContainer');
    const shippingItems = shippingContainer.querySelectorAll('.shipping-item');

    try {
        showLoading('shippingContainer');

        for (let item of shippingItems) {
            const shippingId = item.getAttribute('data-shipping-id');
            const title = item.querySelector('.shipping-title').value;
            const description = item.querySelector('.shipping-description').value;

            const shippingData = {
                title: title,
                description: description
            };

            if (shippingId && shippingId !== 'null') {
                // Update existing shipping
                await updateShippingInBackend(shippingId, shippingData);
            } else {
                // Create new shipping
                const newShipping = await createShippingInBackend(shippingData);
                if (newShipping) {
                    item.setAttribute('data-shipping-id', newShipping.id);
                }
            }
        }

        hideLoading('shippingContainer');
        showSuccess('All shipping data saved successfully!', 'shippingContainer');

    } catch (error) {
        hideLoading('shippingContainer');
        console.error('Error saving shipping data:', error);
        showError('Failed to save shipping data. Please try again.', 'shippingContainer');
    }
}

// Function to create shipping in backend
async function createShippingInBackend(shippingData) {
    try {
        const response = await fetch(`${SHIPPING_API_BASE_URL}/create-shipping`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shippingData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating shipping:', error);
        throw error;
    }
}

// Function to update shipping in backend
async function updateShippingInBackend(id, shippingData) {
    try {
        const response = await fetch(`${SHIPPING_API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shippingData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating shipping:', error);
        throw error;
    }
}

// Function to update single shipping
async function updateShipping(id) {
    const shippingItem = document.querySelector(`[data-shipping-id="${id}"]`);
    if (!shippingItem) return;

    const title = shippingItem.querySelector('.shipping-title').value;
    const description = shippingItem.querySelector('.shipping-description').value;

    const shippingData = {
        title: title,
        description: description
    };

    try {
        await updateShippingInBackend(id, shippingData);
        showSuccess('Shipping data updated successfully!', 'shippingContainer');
    } catch (error) {
        showError('Failed to update shipping data. Please try again.', 'shippingContainer');
    }
}

// Function to delete shipping
async function deleteShipping(id) {
    if (!confirm('Are you sure you want to delete this shipping item?')) {
        return;
    }

    try {
        const response = await fetch(`${SHIPPING_API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove from DOM
        const shippingItem = document.querySelector(`[data-shipping-id="${id}"]`);
        if (shippingItem) {
            shippingItem.remove();
        }

        showSuccess('Shipping item deleted successfully!', 'shippingContainer');

    } catch (error) {
        console.error('Error deleting shipping:', error);
        showError('Failed to delete shipping item. Please try again.', 'shippingContainer');
    }
}

// Function to search shipping by title
async function searchShippingByTitle(title) {
    if (!title.trim()) {
        loadShippingFromBackend();
        return;
    }

    try {
        showLoading('shippingContainer');

        const response = await fetch(`${SHIPPING_API_BASE_URL}/search/title?title=${encodeURIComponent(title)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const shippings = await response.json();
        hideLoading('shippingContainer');

        populateShippingFromBackend(shippings);

    } catch (error) {
        hideLoading('shippingContainer');
        console.error('Error searching shipping by title:', error);
        showError('Failed to search shipping data. Please try again.', 'shippingContainer');
    }
}

// Function to search shipping by description
async function searchShippingByDescription(description) {
    if (!description.trim()) {
        loadShippingFromBackend();
        return;
    }

    try {
        showLoading('shippingContainer');

        const response = await fetch(`${SHIPPING_API_BASE_URL}/search/description?description=${encodeURIComponent(description)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const shippings = await response.json();
        hideLoading('shippingContainer');

        populateShippingFromBackend(shippings);

    } catch (error) {
        hideLoading('shippingContainer');
        console.error('Error searching shipping by description:', error);
        showError('Failed to search shipping data. Please try again.', 'shippingContainer');
    }
}

// Function to save single shipping item
async function saveSingleShipping(button) {
    const shippingItem = button.closest('.shipping-item');
    const title = shippingItem.querySelector('.shipping-title').value;
    const description = shippingItem.querySelector('.shipping-description').value;

    if (!title.trim() || !description.trim()) {
        showError('Please fill in both title and description fields.', 'shippingContainer');
        return;
    }

    const shippingData = {
        title: title,
        description: description
    };

    try {
        const newShipping = await createShippingInBackend(shippingData);
        if (newShipping) {
            shippingItem.setAttribute('data-shipping-id', newShipping.id);

            // Update buttons
            const buttonContainer = shippingItem.querySelector('.mb-3:last-child');
            buttonContainer.innerHTML = `
                <button type="button" class="btn btn-primary btn-sm me-2" onclick="updateShipping(${newShipping.id})">Update</button>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteShipping(${newShipping.id})">Delete</button>
            `;

            showSuccess('Shipping item saved successfully!', 'shippingContainer');
        }
    } catch (error) {
        showError('Failed to save shipping item. Please try again.', 'shippingContainer');
    }
}

// =============================
// CANCELLATION BACKEND FUNCTIONS (NEW)
// =============================

// Function to load cancellation data from backend
async function loadCancellationFromBackend() {
    try {
        showLoading('cancellationContainer');

        const response = await fetch(`${CANCELLATION_API_BASE_URL}/get-All-cancellation`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cancellations = await response.json();
        hideLoading('cancellationContainer');

        if (cancellations && cancellations.length > 0) {
            populateCancellationFromBackend(cancellations);
        } else {
            // If no cancellation data found, use dummy data
            populateDummyCancellationData();
        }

    } catch (error) {
        hideLoading('cancellationContainer');
        console.error('Error loading cancellation data:', error);
        showError('Failed to load cancellation data from server. Loading dummy data instead.', 'cancellationContainer');
        populateDummyCancellationData();
    }
}

// Function to populate cancellation data from backend
function populateCancellationFromBackend(cancellations) {
    const cancellationContainer = document.getElementById('cancellationContainer');

    // Clear existing cancellation items
    cancellationContainer.innerHTML = '';

    cancellations.forEach((cancellation, index) => {
        const newItem = document.createElement('div');
        newItem.className = 'cancellation-item mb-4';
        newItem.setAttribute('data-cancellation-id', cancellation.id);
        newItem.innerHTML = `
           <div class="mb-3">
               <label class="form-label">Heading</label>
               <input type="text" class="form-control cancellation-title" placeholder="Enter heading" value="${cancellation.title || ''}">
           </div>
           <div class="mb-3">
               <label class="form-label">Content</label>
               <textarea class="form-control cancellation-description" rows="3" placeholder="Enter content">${cancellation.description || ''}</textarea>
           </div>
           <div class="mb-3">
               <button type="button" class="btn btn-primary btn-sm me-2" onclick="updateCancellation(${cancellation.id})">Update</button>
               <button type="button" class="btn btn-danger btn-sm" onclick="deleteCancellation(${cancellation.id})">Delete</button>
           </div>
       `;

        cancellationContainer.appendChild(newItem);
    });
}

// Function to save all cancellation data to backend
async function saveAllCancellationToBackend() {
    const cancellationContainer = document.getElementById('cancellationContainer');
    const cancellationItems = cancellationContainer.querySelectorAll('.cancellation-item');

    try {
        showLoading('cancellationContainer');

        for (let item of cancellationItems) {
            const cancellationId = item.getAttribute('data-cancellation-id');
            const title = item.querySelector('.cancellation-title').value;
            const description = item.querySelector('.cancellation-description').value;

            const cancellationData = {
                title: title,
                description: description
            };

            if (cancellationId && cancellationId !== 'null') {
                // Update existing cancellation
                await updateCancellationInBackend(cancellationId, cancellationData);
            } else {
                // Create new cancellation
                const newCancellation = await createCancellationInBackend(cancellationData);
                if (newCancellation) {
                    item.setAttribute('data-cancellation-id', newCancellation.id);
                }
            }
        }

        hideLoading('cancellationContainer');
        showSuccess('All cancellation data saved successfully!', 'cancellationContainer');

    } catch (error) {
        hideLoading('cancellationContainer');
        console.error('Error saving cancellation data:', error);
        showError('Failed to save cancellation data. Please try again.', 'cancellationContainer');
    }
}

// Function to create cancellation in backend
async function createCancellationInBackend(cancellationData) {
    try {
        const response = await fetch(`${CANCELLATION_API_BASE_URL}/create-cancellation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cancellationData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating cancellation:', error);
        throw error;
    }
}

// Function to update cancellation in backend
async function updateCancellationInBackend(id, cancellationData) {
    try {
        const response = await fetch(`${CANCELLATION_API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cancellationData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating cancellation:', error);
        throw error;
    }
}

// Function to update single cancellation
async function updateCancellation(id) {
    const cancellationItem = document.querySelector(`[data-cancellation-id="${id}"]`);
    if (!cancellationItem) return;

    const title = cancellationItem.querySelector('.cancellation-title').value;
    const description = cancellationItem.querySelector('.cancellation-description').value;

    const cancellationData = {
        title: title,
        description: description
    };

    try {
        await updateCancellationInBackend(id, cancellationData);
        showSuccess('Cancellation data updated successfully!', 'cancellationContainer');
    } catch (error) {
        showError('Failed to update cancellation data. Please try again.', 'cancellationContainer');
    }
}

// Function to delete cancellation
async function deleteCancellation(id) {
    if (!confirm('Are you sure you want to delete this cancellation item?')) {
        return;
    }

    try {
        const response = await fetch(`${CANCELLATION_API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove from DOM
        const cancellationItem = document.querySelector(`[data-cancellation-id="${id}"]`);
        if (cancellationItem) {
            cancellationItem.remove();
        }

        showSuccess('Cancellation item deleted successfully!', 'cancellationContainer');

    } catch (error) {
        console.error('Error deleting cancellation:', error);
        showError('Failed to delete cancellation item. Please try again.', 'cancellationContainer');
    }
}

// Function to search cancellation by title
async function searchCancellationByTitle(title) {
    if (!title.trim()) {
        loadCancellationFromBackend();
        return;
    }

    try {
        showLoading('cancellationContainer');

        const response = await fetch(`${CANCELLATION_API_BASE_URL}/search?title=${encodeURIComponent(title)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cancellations = await response.json();
        hideLoading('cancellationContainer');

        populateCancellationFromBackend(cancellations);

    } catch (error) {
        hideLoading('cancellationContainer');
        console.error('Error searching cancellation by title:', error);
        showError('Failed to search cancellation data. Please try again.', 'cancellationContainer');
    }
}

// Function to save single cancellation item
async function saveSingleCancellation(button) {
    const cancellationItem = button.closest('.cancellation-item');
    const title = cancellationItem.querySelector('.cancellation-title').value;
    const description = cancellationItem.querySelector('.cancellation-description').value;

    if (!title.trim() || !description.trim()) {
        showError('Please fill in both title and description fields.', 'cancellationContainer');
        return;
    }

    const cancellationData = {
        title: title,
        description: description
    };

    try {
        const newCancellation = await createCancellationInBackend(cancellationData);
        if (newCancellation) {
            cancellationItem.setAttribute('data-cancellation-id', newCancellation.id);

            // Update buttons
            const buttonContainer = cancellationItem.querySelector('.mb-3:last-child');
            buttonContainer.innerHTML = `
                <button type="button" class="btn btn-primary btn-sm me-2" onclick="updateCancellation(${newCancellation.id})">Update</button>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteCancellation(${newCancellation.id})">Delete</button>
            `;

            showSuccess('Cancellation item saved successfully!', 'cancellationContainer');
        }
    } catch (error) {
        showError('Failed to save cancellation item. Please try again.', 'cancellationContainer');
    }
}

// =============================
// OVERLAY FUNCTIONS (EXISTING)
// =============================

// Function to open overlay
function openOverlay(id) {
    document.getElementById(id).style.display = 'flex';
}

// Function to close overlay
function closeOverlay(id) {
    document.getElementById(id).style.display = 'none';
}

// =============================
// ADD ITEM FUNCTIONS (EXISTING + ENHANCED)
// =============================

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

// Function to add Shipping item (enhanced with backend connectivity)
function addShippingItem() {
    const container = document.getElementById('shippingContainer');
    const count = container.children.length + 1;

    const newItem = document.createElement('div');
    newItem.className = 'shipping-item mb-4';
    newItem.setAttribute('data-shipping-id', 'null'); // Mark as new item
    newItem.innerHTML = `
       <div class="mb-3">
           <label class="form-label">Heading</label>
           <input type="text" class="form-control shipping-title" placeholder="Enter heading">
       </div>
       <div class="mb-3">
           <label class="form-label">Content</label>
           <textarea class="form-control shipping-description" rows="3" placeholder="Enter content"></textarea>
       </div>
       <div class="mb-3">
           <button type="button" class="btn btn-success btn-sm me-2" onclick="saveSingleShipping(this)">Save</button>
           <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeShippingItem(this)">Remove</button>
       </div>
   `;

    container.appendChild(newItem);
}

// Function to remove shipping item from DOM (for unsaved items)
function removeShippingItem(button) {
    const shippingItem = button.closest('.shipping-item');
    shippingItem.remove();
}

// Function to add Cancellation item
function addCancellationItem() {
    const container = document.getElementById('cancellationContainer');
    const count = container.children.length + 1;

    const newItem = document.createElement('div');
    newItem.className = 'cancellation-item mb-4';
    newItem.setAttribute('data-cancellation-id', 'null'); // Mark as new item
    newItem.innerHTML = `
       <div class="mb-3">
           <label class="form-label">Heading</label>
           <input type="text" class="form-control cancellation-title" placeholder="Enter heading">
       </div>
       <div class="mb-3">
           <label class="form-label">Content</label>
           <textarea class="form-control cancellation-description" rows="3" placeholder="Enter content"></textarea>
       </div>
       <div class="mb-3">
           <button type="button" class="btn btn-success btn-sm me-2" onclick="saveSingleCancellation(this)">Save</button>
           <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeCancellationItem(this)">Remove</button>
       </div>
   `;

    container.appendChild(newItem);
}

// Function to remove cancellation item from DOM (for unsaved items)
function removeCancellationItem(button) {
    const cancellationItem = button.closest('.cancellation-item');
    cancellationItem.remove();
}

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

// Call the function when DOM is fully loaded
document.addEventListener('DOMContentLoaded', populateDummyData);