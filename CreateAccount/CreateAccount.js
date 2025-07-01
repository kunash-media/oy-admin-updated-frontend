// Your backend server URL - CHANGE THIS to your actual server URL
const API_BASE_URL = 'http://localhost:8080'; // Change port if different

function validatePassword() {
    let password = document.getElementById("password ");
    if (/^[a-zA-Z0-9]+$/.test(password.value) && password.value.length >= 6) {
        password.classList.add("valid ");
        password.classList.remove("invalid ");
    } else {
        password.classList.add("invalid ");
        password.classList.remove("valid ");
    }
}

function checkPasswordMatch() {
    let password = document.getElementById("password ").value;
    let confirmPassword = document.getElementById("confirm-password ");

    if (confirmPassword.value === password && confirmPassword.value.length >= 6) {
        confirmPassword.classList.add("valid ");
        confirmPassword.classList.remove("invalid ");
    } else {
        confirmPassword.classList.add("invalid ");
        confirmPassword.classList.remove("valid ");
    }
}

// Function to handle login navigation
function navigateToLogin(event) {
    event.preventDefault();
    // Try multiple possible paths for Login.html
    const possiblePaths = ['./Login.html', 'Login.html', '../Login.html'];
    let currentPath = 0;

    function tryNavigate() {
        if (currentPath < possiblePaths.length) {
            window.location.href = possiblePaths[currentPath];
        } else {
            alert('Could not find Login.html. Please check the file path.');
        }
    }

    tryNavigate();
}

// Handle form submission
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const name = document.getElementById("name ").value.trim();
    const email = document.getElementById("email ").value.trim();
    const contact = document.getElementById("contact ").value.trim();
    const role = document.getElementById("role ").value;
    const password = document.getElementById("password ").value;
    const confirmPassword = document.getElementById("confirm-password ").value;
    const privacyPolicy = document.getElementById("privacy-policy ").checked;

    // Validate form
    if (name === " ") {
        alert("Name cannot be empty ");
        return;
    }
    if (!email.includes("@ ") || email === " ") {
        alert("Please enter a valid email ");
        return;
    }
    if (!contact) {
        alert("Please enter contact number ");
        return;
    }
    if (!role) {
        alert("Please select a role ");
        return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
        alert("Password must contain only alphanumeric characters ");
        return;
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters long ");
        return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match ");
        return;
    }
    if (!privacyPolicy) {
        alert("You must agree to the privacy policy ");
        return;
    }

    // Show loading state
    const createBtn = document.getElementById('createBtn');
    const originalText = createBtn.textContent;
    createBtn.textContent = 'Creating...';
    createBtn.disabled = true;
    document.querySelector('.account-form').classList.add('loading');

    try {
        // Prepare data for backend
        const adminData = {
            name: name,
            email: email,
            contactNumber: contact,
            role: role,
            password: password
        };

        // Send data to backend
        const response = await fetch(`${API_BASE_URL}/api/admin/create-admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminData)
        });

        if (response.ok) {
            const result = await response.json();
            alert('Account created successfully!');

            // Store the created admin data in localStorage to pass to staff page
            localStorage.setItem('newStaffMember', JSON.stringify({
                id: result.id,
                name: result.name,
                email: result.email,
                contact: result.contactNumber,
                role: result.role,
                joiningDate: new Date().toISOString().split('T')[0],
                status: 'Active'
            }));

            // Reset form
            document.getElementById('registrationForm').reset();

            // Redirect to staff page after 2 seconds
            setTimeout(() => {
                window.location.href = 'fourteen.html'; // Your staff page
            }, 2000);

        } else {
            const errorData = await response.json();
            alert('Error creating account: ' + (errorData.message || 'Please try again'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Network error. Please check if your server is running and try again.');

        // If there's a network error, still allow navigation to login
        setTimeout(() => {
            if (confirm('Would you like to go to the login page?')) {
                navigateToLogin(new Event('click'));
            }
        }, 1000);
    } finally {
        // Reset loading state
        createBtn.textContent = originalText;
        createBtn.disabled = false;
        document.querySelector('.account-form').classList.remove('loading');
    }
});