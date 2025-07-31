// Backend API Configuration
const API_BASE_URL = 'https://api.oyjewells.com';
const API_ENDPOINT = `${API_BASE_URL}/api/admin/create-admin`;

// Form Elements
const form = document.getElementById('registrationForm');
const createBtn = document.getElementById('createBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const successMessage = document.getElementById('successMessage');

// Form Fields
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const mobileField = document.getElementById('mobileNumber');
const roleField = document.getElementById('role');
const passwordField = document.getElementById('password');
const confirmPasswordField = document.getElementById('confirmPassword');
const privacyField = document.getElementById('privacyPolicy');

// Error Elements
const errorElements = {
    name: document.getElementById('nameError'),
    email: document.getElementById('emailError'),
    mobile: document.getElementById('mobileError'),
    role: document.getElementById('roleError'),
    password: document.getElementById('passwordError'),
    confirmPassword: document.getElementById('confirmPasswordError'),
    policy: document.getElementById('policyError')
};

// Validation Functions
function validateName(name) {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
        return 'Name is required';
    }
    if (trimmed.length < 2) {
        return 'Name must be at least 2 characters long';
    }
    if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
        return 'Name can only contain letters and spaces';
    }
    return null;
}

function validateEmail(email) {
    const trimmed = email.trim();
    if (trimmed.length === 0) {
        return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
        return 'Please enter a valid email address';
    }
    return null;
}

function validateMobile(mobile) {
    const trimmed = mobile.trim();
    if (trimmed.length === 0) {
        return 'Mobile number is required';
    }
    if (!/^\d{10}$/.test(trimmed)) {
        return 'Mobile number must be exactly 10 digits';
    }
    return null;
}

function validateRole(role) {
    if (!role || role.trim() === '') {
        return 'Please select a role';
    }
    const validRoles = ['ADMIN', 'CASHIER', 'ACCOUNTANT'];
    if (!validRoles.includes(role)) {
        return 'Please select a valid role';
    }
    return null;
}

function validatePassword(password) {
    if (password.length === 0) {
        return 'Password is required';
    }
    if (password.length < 6) {
        return 'Password must be at least 6 characters long';
    }
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
        return 'Password can only contain letters and numbers';
    }
    return null;
}

function validateConfirmPassword(password, confirmPassword) {
    if (confirmPassword.length === 0) {
        return 'Please confirm your password';
    }
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    return null;
}

function validatePrivacyPolicy(checked) {
    if (!checked) {
        return 'You must agree to the privacy policy and terms of service';
    }
    return null;
}

// UI Helper Functions
function showError(field, message) {
    const errorElement = errorElements[field];
    const inputElement = document.getElementById(field === 'mobile' ? 'mobileNumber' : field === 'confirmPassword' ? 'confirmPassword' : field);
    
    if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        inputElement.classList.add('is-invalid');
        inputElement.classList.remove('is-valid');
    }
}

function hideError(field) {
    const errorElement = errorElements[field];
    const inputElement = document.getElementById(field === 'mobile' ? 'mobileNumber' : field === 'confirmPassword' ? 'confirmPassword' : field);
    
    if (errorElement && inputElement) {
        errorElement.classList.remove('show');
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
    }
}

function clearAllErrors() {
    Object.keys(errorElements).forEach(field => {
        const errorElement = errorElements[field];
        const inputElement = document.getElementById(field === 'mobile' ? 'mobileNumber' : field === 'confirmPassword' ? 'confirmPassword' : field);
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        if (inputElement) {
            inputElement.classList.remove('is-invalid', 'is-valid');
        }
    });
}

function setLoadingState(isLoading) {
    if (isLoading) {
        createBtn.disabled = true;
        createBtn.classList.add('loading');
        document.querySelector('.account-form').classList.add('loading');
    } else {
        createBtn.disabled = false;
        createBtn.classList.remove('loading');
        document.querySelector('.account-form').classList.remove('loading');
    }
}

function showSuccessMessage() {
    form.style.display = 'none';
    successMessage.classList.add('show');
}

function resetForm() {
    form.reset();
    clearAllErrors();
}

// Real-time Validation
nameField.addEventListener('blur', function() {
    const error = validateName(this.value);
    if (error) {
        showError('name', error);
    } else {
        hideError('name');
    }
});

emailField.addEventListener('blur', function() {
    const error = validateEmail(this.value);
    if (error) {
        showError('email', error);
    } else {
        hideError('email');
    }
});

mobileField.addEventListener('blur', function() {
    const error = validateMobile(this.value);
    if (error) {
        showError('mobile', error);
    } else {
        hideError('mobile');
    }
});

roleField.addEventListener('change', function() {
    const error = validateRole(this.value);
    if (error) {
        showError('role', error);
    } else {
        hideError('role');
    }
});

passwordField.addEventListener('input', function() {
    const error = validatePassword(this.value);
    if (error) {
        showError('password', error);
    } else {
        hideError('password');
    }
    
    // Also validate confirm password if it has a value
    if (confirmPasswordField.value) {
        const confirmError = validateConfirmPassword(this.value, confirmPasswordField.value);
        if (confirmError) {
            showError('confirmPassword', confirmError);
        } else {
            hideError('confirmPassword');
        }
    }
});

confirmPasswordField.addEventListener('blur', function() {
    const error = validateConfirmPassword(passwordField.value, this.value);
    if (error) {
        showError('confirmPassword', error);
    } else {
        hideError('confirmPassword');
    }
});

privacyField.addEventListener('change', function() {
    const error = validatePrivacyPolicy(this.checked);
    if (error) {
        showError('policy', error);
    } else {
        hideError('policy');
    }
});

// Form Submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Clear all previous errors
    clearAllErrors();
    
    // Get form values
    const formData = {
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        mobileNumber: mobileField.value.trim(),
        role: roleField.value,
        password: passwordField.value,
        confirmPassword: confirmPasswordField.value,
        privacyPolicy: privacyField.checked
    };
    
    // Validate all fields
    let hasErrors = false;
    
    const nameError = validateName(formData.name);
    if (nameError) {
        showError('name', nameError);
        hasErrors = true;
    }
    
    const emailError = validateEmail(formData.email);
    if (emailError) {
        showError('email', emailError);
        hasErrors = true;
    }
    
    const mobileError = validateMobile(formData.mobileNumber);
    if (mobileError) {
        showError('mobile', mobileError);
        hasErrors = true;
    }
    
    const roleError = validateRole(formData.role);
    if (roleError) {
        showError('role', roleError);
        hasErrors = true;
    }
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
        showError('password', passwordError);
        hasErrors = true;
    }
    
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) {
        showError('confirmPassword', confirmPasswordError);
        hasErrors = true;
    }
    
    const policyError = validatePrivacyPolicy(formData.privacyPolicy);
    if (policyError) {
        showError('policy', policyError);
        hasErrors = true;
    }
    
    // If there are validation errors, don't submit
    if (hasErrors) {
        return;
    }
    
    // Prepare API payload (matching backend DTO structure)
    const apiPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        mobileNumber: formData.mobileNumber  // Add this line
    };
    
    // Set loading state
    setLoadingState(true);
    
    try {
        // Make API call
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiPayload)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Admin created successfully:', result);
            
            // Show success message
            showSuccessMessage();
            
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                navigateToLogin();
            }, 3000);
            
        } else {
            // Handle API errors
            const errorData = await response.json();
            let errorMessage = 'Failed to create account. Please try again.';
            
            if (errorData.message) {
                errorMessage = errorData.message;
            } else if (response.status === 400) {
                errorMessage = 'Invalid data provided. Please check your inputs.';
            } else if (response.status === 409) {
                errorMessage = 'An account with this email already exists.';
            } else if (response.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            }
            
            alert(errorMessage);
            console.error('API Error:', errorData);
        }
        
    } catch (error) {
        console.error('Network Error:', error);
        alert('Network error. Please check your connection and ensure the server is running.');
    } finally {
        // Remove loading state
        setLoadingState(false);
    }
});

// Navigation Functions
function navigateToLogin() {
    // Try multiple potential paths for the login page
    const loginPaths = [
        '../Login/Login.html',
        '../Login.html',
        './Login/Login.html',
        'Login.html'
    ];
    
    // Try to navigate to the first available path
    // In a real application, you might want to check if the file exists
    // For now, we'll use the most likely path based on the HTML structure
    window.location.href = loginPaths[0]; // '../Login/Login.html'
}

// Additional utility functions
function navigateToHome() {
    window.location.href = '../Home/Home.html';
}

function navigateToDashboard() {
    window.location.href = '../Dashboard/Dashboard.html';
}

// Handle browser back button
window.addEventListener('popstate', function(event) {
    // Handle back button if needed
    console.log('Back button pressed');
});

// Initialize the form when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Clear any existing form data
    resetForm();
    
    // Focus on the name field
    if (nameField) {
        nameField.focus();
    }
    
    // Hide success message on page load
    if (successMessage) {
        successMessage.classList.remove('show');
    }
    
    // Ensure form is visible
    if (form) {
        form.style.display = 'block';
    }
});

// Handle page refresh/reload
window.addEventListener('beforeunload', function(event) {
    // You can add any cleanup code here if needed
    console.log('Page is about to be refreshed/closed');
});

// Additional helper function for form reset
function resetFormToInitialState() {
    resetForm();
    setLoadingState(false);
    
    // Hide success message
    if (successMessage) {
        successMessage.classList.remove('show');
    }
    
    // Show form
    if (form) {
        form.style.display = 'block';
    }
}

// Export functions if needed (for module systems)
// Uncomment if using modules
/*
export {
    navigateToLogin,
    navigateToHome,
    navigateToDashboard,
    resetFormToInitialState
};
*/