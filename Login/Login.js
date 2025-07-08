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

        // Mock login for testing (remove in production)
        console.log('Mock login - would send:', { username, password });
        window.location.href = "../Dashboard/Dashboard.html";
        return;

        // Actual API code (commented out for now)
        
        try {
            const existsResponse = await fetch(`/api/admin/exists/${username}`);
            if (!existsResponse.ok) throw new Error('API unavailable');
            
            const exists = await existsResponse.json();
            if (!exists) {
                alert("Admin not found. Please check your username.");
                return;
            }

            const adminResponse = await fetch(`/api/admin/email/${username}`);
            if (!adminResponse.ok) throw new Error('Admin data fetch failed');
            
            // If everything succeeds
            window.location.href = "../Dashboard/Dashboard.html";
            
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Please try again.");
        }
        
    });
});