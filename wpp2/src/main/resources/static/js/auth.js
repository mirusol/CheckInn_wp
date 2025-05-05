// Auto-login authentication module for CheckInn frontend

// Auto-login function - automatically logs in the user
function autoLogin(role = 'CLIENT') {
    // Check if user is already logged in
    if (isLoggedIn()) {
        return; // User is already logged in
    }

    // Create user based on desired role
    const user = (role === 'ADMIN') ?
        {
            id: 'user2',
            name: 'Admin User',
            email: 'user2@example.com',
            role: 'ADMIN'
        } :
        {
            id: 'user1',
            name: 'Client User',
            email: 'user1@example.com',
            role: 'CLIENT'
        };

    // Store user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log('Auto-login complete as', role);
}

// Initialize auth functionality - THIS WILL AUTO LOGIN!
document.addEventListener('DOMContentLoaded', function() {
    // Automatically log in based on page type
    if (window.location.pathname.includes('/admin/')) {
        autoLogin('ADMIN');
    } else {
        autoLogin('CLIENT');
    }

    // If we're on the login page, redirect to appropriate dashboard
    if (window.location.pathname.includes('login.html')) {
        const currentUser = getCurrentUser();
        if (currentUser) {
            if (currentUser.role === 'ADMIN') {
                window.location.href = 'admin/dashboard.html';
            } else {
                window.location.href = 'client/dashboard.html';
            }
        }
    }

    // Handle login form submission if it exists
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value || document.getElementById('email').value;

            // Login as admin if username is user2, otherwise as client
            if (username === 'user2') {
                autoLogin('ADMIN');
                window.location.href = 'admin/dashboard.html';
            } else {
                autoLogin('CLIENT');
                window.location.href = 'client/dashboard.html';
            }
        });
    }
});

// Standard authentication functions that should already exist in your code
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

function logout() {
    localStorage.removeItem('currentUser');

    // Redirect to login page
    let redirectPath = '';
    if (window.location.pathname.includes('/html/client/') || window.location.pathname.includes('/html/admin/')) {
        redirectPath = '../../html/login.html';
    } else if (window.location.pathname.includes('/html/')) {
        redirectPath = 'login.html';
    } else {
        redirectPath = 'html/login.html';
    }

    window.location.href = redirectPath;
}

function protectRoute() {
    // With auto-login, we don't need to protect routes
    // But we'll maintain this function for compatibility
    if (!isLoggedIn()) {
        // Auto-login instead of redirecting
        if (window.location.pathname.includes('/admin/')) {
            autoLogin('ADMIN');
        } else {
            autoLogin('CLIENT');
        }
    }
    return true; // Always return true with auto-login
}

function checkRole(allowedRoles) {
    const user = getCurrentUser();
    if (!user || !allowedRoles.includes(user.role)) {
        // If on admin page but not admin, change to admin
        if (window.location.pathname.includes('/admin/') && !allowedRoles.includes('ADMIN')) {
            autoLogin('ADMIN');
            return true;
        }

        // If on client page but not client, change to client
        if (window.location.pathname.includes('/client/') && !allowedRoles.includes('CLIENT')) {
            autoLogin('CLIENT');
            return true;
        }
    }
    return true; // Always return true with auto-login
}

// Get all users (admin function) - Mock data
function getAllUsers() {
    return [
        {
            id: 'user1',
            name: 'Client User',
            email: 'user1@example.com',
            role: 'CLIENT',
            registeredDate: '2025-04-01'
        },
        {
            id: 'user2',
            name: 'Admin User',
            email: 'user2@example.com',
            role: 'ADMIN',
            registeredDate: '2025-04-01'
        }
    ];
}
