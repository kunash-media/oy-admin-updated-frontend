document.addEventListener('DOMContentLoaded', function() {
    // Parse query parameters
    function getQueryParams() {
        const params = {};
        window.location.search.substring(1).split("&").forEach(pair => {
            const [key, value] = pair.split("=");
            if (key && value) {
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            }
        });
        return params;
    }

    // Handle welcome message if name parameter exists
    const params = getQueryParams();
    if (params.name) {
        const usernameInput = document.getElementById("username");
        if (usernameInput) {
            usernameInput.value = params.name;
            alert(`Welcome ${params.name}! Please enter your password to login.`);
        }
    }

    // Add form submission handler
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) {
        console.error('Login form not found!');
        return;
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // First verify dashboard exists
        try {
            const dashboardCheck = await fetch('../Dashboard/Dashboard.html');
            if (!dashboardCheck.ok) {
                throw new Error('Dashboard page not found');
            }
        } catch (err) {
            console.error('Dashboard check failed:', err);
            alert('System error: Could not verify dashboard page');
            return;
        }

        // API Login Implementation
        try {
            // Call the login API
            const response = await fetch('http://localhost:8080/api/admin/login-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: username,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error(`Login failed: ${response.status}`);
            }

            const adminData = await response.json();
            
            // Store session using admin-global-js
            if (window.AdminSession) {
                window.AdminSession.setSession(adminData);
                console.log('Session stored for admin:', adminData.name);
            } else {
                console.error('AdminSession not available');
            }

            // Redirect to dashboard
            window.location.href = "../Dashboard/Dashboard.html";
            
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Please check your credentials and try again.");
        }

        // Mock login for testing (comment out the API code above and uncomment below for testing)
        /*
        console.log('Mock login - would send:', { username, password });
        
        // Mock admin data for testing
        const mockAdminData = {
            id: 9,
            name: "Test Admin",
            mobileNumber: "1234567890",
            email: username,
            role: "ADMIN",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Store mock session
        if (window.AdminSession) {
            window.AdminSession.setSession(mockAdminData);
            console.log('Mock session stored for admin:', mockAdminData.name);
        }
        
        window.location.href = "../Dashboard/Dashboard.html";
        */
    });
}); 