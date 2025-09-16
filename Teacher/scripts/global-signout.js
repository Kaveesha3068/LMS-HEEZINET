/**
 * ===== EduLMS Global Sign Out Functionality =====
 * Universal sign out functionality for all pages in the LMS system
 * 
 * This script can be included in any page to provide consistent sign out behavior
 * 
 * @version 1.0.0
 * @author EduLMS Team
 * @license MIT
 */

// ===== GLOBAL SIGN OUT FUNCTIONS =====

/**
 * Handle sign out functionality with confirmation
 * This function can be called from any page to properly sign out the user
 */
// ===== GLOBAL SIGN OUT FUNCTION =====

/**
 * Handle sign out functionality
 * This function can be called from any page to properly sign out the user
 */
function handleSignOut() {
    // Show confirmation dialog
    const confirmSignOut = confirm('Are you sure you want to sign out?');
    
    if (confirmSignOut) {
        try {
            // Clear any session data (if using sessionStorage)
            sessionStorage.clear();
            
            // Clear any temporary authentication tokens
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_session');
            localStorage.removeItem('login_timestamp');
            
            // Optional: Clear all LMS data (uncomment if needed)
            // localStorage.clear();
            
            // Show sign out notification
            if (typeof attendanceManager !== 'undefined' && attendanceManager.showNotification) {
                attendanceManager.showNotification('Signing out...', 'info');
            }
            
            // Small delay to show the notification, then redirect
            setTimeout(() => {
                // Redirect to login page
                window.location.href = 'login.html';
            }, 500);
            
        } catch (error) {
            console.error('Error during sign out:', error);
            // Force redirect even if there's an error
            window.location.href = 'login.html';
        }
    }
}

/**
 * Perform the actual sign out process
 * @param {string} reason - Reason for signing out (for logging)
 */
function performSignOut(reason = 'Manual sign out') {
    try {
        // Log the sign out action
        console.log('EduLMS Sign Out:', reason);
        
        // Clear session storage (temporary data)
        if (typeof Storage !== 'undefined') {
            sessionStorage.clear();
        }
        
        // Clear authentication related data from localStorage
        const authKeys = [
            'auth_token',
            'user_session', 
            'login_timestamp',
            'remember_me',
            'user_preferences',
            'last_login'
        ];
        
        authKeys.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Optional: Clear all LMS data (uncomment if you want to clear everything)
        // localStorage.clear();
        
        // Show sign out notification if available
        showSignOutNotification();
        
        // Small delay to show the notification, then redirect
        setTimeout(() => {
            redirectToLogin();
        }, 1000);
        
    } catch (error) {
        console.error('Error during sign out:', error);
        // Force redirect even if there's an error
        redirectToLogin();
    }
}

/**
 * Force sign out without confirmation (for session timeouts, errors, etc.)
 * @param {string} reason - Reason for the forced sign out
 */
function forceSignOut(reason = 'Session expired') {
    performSignOut(reason);
}

/**
 * Show sign out notification if notification system is available
 */
function showSignOutNotification() {
    // Try different notification methods based on what's available
    
    // Method 1: Try attendance manager notification
    if (typeof attendanceManager !== 'undefined' && attendanceManager.showNotification) {
        attendanceManager.showNotification('Signing out...', 'info');
        return;
    }
    
    // Method 2: Try Bootstrap toast if available
    if (typeof bootstrap !== 'undefined') {
        try {
            const toastElement = document.getElementById('signOutToast');
            if (toastElement) {
                const toast = new bootstrap.Toast(toastElement);
                toast.show();
                return;
            }
        } catch (e) {
            // Toast not available, continue to next method
        }
    }
    
    // Method 3: Simple browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('EduLMS', {
            body: 'Signing out...',
            icon: '../../frontend/assets/images/EduLMS-icon.ico'
        });
        return;
    }
    
    // Method 4: Console log as fallback
    console.log('EduLMS: Signing out...');
}

/**
 * Redirect to login page with proper path handling
 */
function redirectToLogin() {
    try {
        // Determine the correct path to login.html based on current location
        const currentPath = window.location.pathname;
        let loginPath = 'login.html';
        
        // If we're in a subdirectory, adjust the path
        if (currentPath.includes('/admin/admin-login/')) {
            loginPath = 'login.html';
        } else if (currentPath.includes('/admin/')) {
            loginPath = 'admin-login/login.html';
        } else if (currentPath.includes('/student/')) {
            loginPath = '../student/student-login/login.html';
        } else if (currentPath.includes('/teacher/')) {
            loginPath = '../teacher/teacher-login/login.html';
        }
        
        // Redirect to login page
        window.location.href = loginPath;
        
    } catch (error) {
        console.error('Error redirecting to login:', error);
        // Fallback: try common login paths
        const fallbackPaths = [
            'login.html',
            '../login.html',
            '../../login.html',
            '/admin/admin-login/login.html'
        ];
        
        // Try the first fallback path
        window.location.href = fallbackPaths[0];
    }
}

// ===== SESSION MANAGEMENT =====

/**
 * Check if user session is valid
 * @returns {boolean} - True if session is valid, false otherwise
 */
function checkSession() {
    try {
        const loginTimestamp = localStorage.getItem('login_timestamp');
        const authToken = localStorage.getItem('auth_token');
        
        // If no login data, session is invalid
        if (!loginTimestamp || !authToken) {
            return false;
        }
        
        // Check if session is older than maximum allowed time (8 hours)
        const sessionAge = Date.now() - parseInt(loginTimestamp);
        const maxSessionAge = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
        
        if (sessionAge > maxSessionAge) {
            forceSignOut('Session timeout');
            return false;
        }
        
        return true;
        
    } catch (error) {
        console.error('Error checking session:', error);
        return false;
    }
}

/**
 * Initialize session monitoring
 */
function initializeSessionMonitoring() {
    // Check session validity every 5 minutes
    setInterval(() => {
        if (!checkSession()) {
            console.log('Session check failed, user will be signed out');
        }
    }, 5 * 60 * 1000); // 5 minutes
    
    // Also check on page focus (when user comes back to the tab)
    window.addEventListener('focus', () => {
        checkSession();
    });
    
    // Check on page visibility change
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            checkSession();
        }
    });
}

/**
 * Update login timestamp (call this when user performs any authenticated action)
 */
function updateLoginTimestamp() {
    try {
        localStorage.setItem('login_timestamp', Date.now().toString());
    } catch (error) {
        console.error('Error updating login timestamp:', error);
    }
}

// ===== AUTOMATIC INITIALIZATION =====

/**
 * Initialize sign out functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 EduLMS Global Sign Out functionality loaded');
    
    // Initialize session monitoring
    initializeSessionMonitoring();
    
    // Update login timestamp on page load (user activity)
    updateLoginTimestamp();
    
    // Add click listeners to all sign out buttons
    const signOutButtons = document.querySelectorAll('.sign-out-btn, [onclick*="handleSignOut"]');
    signOutButtons.forEach(button => {
        // Remove any existing onclick handlers that might conflict
        button.removeAttribute('onclick');
        
        // Add our standardized click handler
        button.addEventListener('click', function(e) {
            e.preventDefault();
            handleSignOut();
        });
    });
    
    // Add activity listeners to update timestamp
    const activityEvents = ['click', 'keypress', 'scroll', 'mousemove'];
    let lastActivity = Date.now();
    
    activityEvents.forEach(eventType => {
        document.addEventListener(eventType, () => {
            const now = Date.now();
            // Only update timestamp if it's been more than 1 minute since last update
            if (now - lastActivity > 60000) {
                updateLoginTimestamp();
                lastActivity = now;
            }
        });
    });
});

// ===== KEYBOARD SHORTCUTS =====

/**
 * Add keyboard shortcut for sign out (Ctrl+Shift+L)
 */
document.addEventListener('keydown', function(e) {
    // Ctrl+Shift+L for sign out
    if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        handleSignOut();
    }
});

// ===== EXPORT FOR MODULE USAGE =====

// If using modules, export the functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleSignOut,
        forceSignOut,
        checkSession,
        updateLoginTimestamp,
        initializeSessionMonitoring
    };
}

console.log('✅ EduLMS Global Sign Out script loaded successfully');
console.log('🔗 Available functions: handleSignOut(), forceSignOut(), checkSession()');
console.log('⌨️  Keyboard shortcut: Ctrl+Shift+L for quick sign out');