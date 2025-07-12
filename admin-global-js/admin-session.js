/**
 * Admin Global Session Management
 * Simple session management without JWT
 */

class AdminSession {
    constructor() {
        this.sessionKey = 'admin_session';
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        this.init();
    }

    init() {
        // Check if session exists and is valid on page load
        this.validateSession();
    }

    /**
     * Store admin session data after successful login
     * @param {Object} adminData - Admin data returned from API
     */
    setSession(adminData) {
        const sessionData = {
            admin: adminData,
            loginTime: new Date().getTime(),
            expiresAt: new Date().getTime() + this.sessionTimeout
        };
        
        // Store in memory (survives page refresh)
        window.adminSessionData = sessionData;
        
        // Also store in sessionStorage for persistence
        sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
        
        console.log('Admin session created:', adminData.name);
    }

    /**
     * Get current admin session data
     * @returns {Object|null} Admin data or null if no valid session
     */
    getSession() {
        // First check memory
        if (window.adminSessionData && this.isSessionValid(window.adminSessionData)) {
            return window.adminSessionData.admin;
        }

        // Check sessionStorage
        const storedSession = sessionStorage.getItem(this.sessionKey);
        if (storedSession) {
            try {
                const sessionData = JSON.parse(storedSession);
                if (this.isSessionValid(sessionData)) {
                    // Restore to memory
                    window.adminSessionData = sessionData;
                    return sessionData.admin;
                }
            } catch (e) {
                console.error('Error parsing session data:', e);
                this.clearSession();
            }
        }

        return null;
    }

    /**
     * Check if current session is valid (not expired)
     * @param {Object} sessionData - Session data to validate
     * @returns {boolean} True if valid, false otherwise
     */
    isSessionValid(sessionData) {
        if (!sessionData || !sessionData.expiresAt) {
            return false;
        }
        
        const now = new Date().getTime();
        return now < sessionData.expiresAt;
    }

    /**
     * Validate current session and redirect if invalid
     */
    validateSession() {
        const currentPage = window.location.pathname;
        const isLoginPage = currentPage.includes('login') || currentPage.includes('Login');
        
        if (!isLoginPage) {
            const session = this.getSession();
            if (!session) {
                // No valid session, redirect to login
                this.redirectToLogin();
                return false;
            }
        }
        
        return true;
    }

    /**
     * Clear admin session (logout)
     */
    clearSession() {
        // Clear memory
        delete window.adminSessionData;
        
        // Clear sessionStorage
        sessionStorage.removeItem(this.sessionKey);
        
        console.log('Admin session cleared');
    }

    /**
     * Logout and redirect to login page
     */
    logout() {
        this.clearSession();
        this.redirectToLogin();
    }

    /**
     * Redirect to login page
     */
    redirectToLogin() {
        // Adjust path based on your folder structure
        const loginPath = '../Login/Login.html';
        window.location.href = loginPath;
    }

    /**
     * Get admin info for display
     * @returns {Object} Admin display info
     */
    getAdminInfo() {
        const session = this.getSession();
        if (session) {
            return {
                name: session.name,
                email: session.email,
                role: session.role,
                id: session.id
            };
        }
        return null;
    }

    /**
     * Check if admin is logged in
     * @returns {boolean} True if logged in, false otherwise
     */
    isLoggedIn() {
        return this.getSession() !== null;
    }

    /**
     * Extend session timeout (refresh session)
     */
    extendSession() {
        const session = this.getSession();
        if (session) {
            const sessionData = window.adminSessionData || JSON.parse(sessionStorage.getItem(this.sessionKey));
            sessionData.expiresAt = new Date().getTime() + this.sessionTimeout;
            
            // Update both memory and storage
            window.adminSessionData = sessionData;
            sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
        }
    }
}

// Create global instance
const adminSession = new AdminSession();

// Global functions for easy access
window.AdminSession = {
    setSession: (adminData) => adminSession.setSession(adminData),
    getSession: () => adminSession.getSession(),
    logout: () => adminSession.logout(),
    isLoggedIn: () => adminSession.isLoggedIn(),
    getAdminInfo: () => adminSession.getAdminInfo(),
    extendSession: () => adminSession.extendSession()
};

// Auto-extend session on user activity
let activityTimer;
function resetActivityTimer() {
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        if (adminSession.isLoggedIn()) {
            adminSession.extendSession();
        }
    }, 5 * 60 * 1000); // Extend after 5 minutes of activity
}

// Listen for user activity
document.addEventListener('click', resetActivityTimer);
document.addEventListener('keypress', resetActivityTimer);
document.addEventListener('scroll', resetActivityTimer);

console.log('Admin Global Session Management loaded');