// Main JavaScript file with common functions

// Set current year in footer if applicable
document.addEventListener('DOMContentLoaded', function() {
    const yearElements = document.querySelectorAll('.current-year');
    if (yearElements) {
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }

    // Check if user is logged in and update UI accordingly
    updateAuthUI();
});

// Update UI based on authentication status
function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    const userMenu = document.getElementById('userMenu');

    if (!authSection && !userMenu) return;

    const isUserLoggedIn = isLoggedIn();

    if (isUserLoggedIn) {
        const user = getCurrentUser();

        if (authSection) {
            authSection.innerHTML = `
                <div class="user-menu">
                    <span>${user.name}</span>
                    <button id="logout-btn" onclick="logout()">Logout</button>
                </div>
            `;
        }

        if (userMenu) {
            const usernameDisplay = document.getElementById('username-display');
            if (usernameDisplay) {
                usernameDisplay.textContent = user.name;
            }
        }
    } else {
        if (userMenu) {
            // Redirect to login if trying to access protected pages
            if (window.location.pathname.includes('/client/') ||
                window.location.pathname.includes('/admin/') ||
                window.location.pathname.includes('profile.html') ||
                window.location.pathname.includes('booking.html')) {
                window.location.href = getRelativePath() + 'login.html';
            }
        }
    }
}

// Get relative path to root based on current location
function getRelativePath() {
    const path = window.location.pathname;
    let relativePath = '';

    if (path.includes('/html/client/') || path.includes('/html/admin/')) {
        relativePath = '../../';
    } else if (path.includes('/html/')) {
        relativePath = '../';
    }

    return relativePath;
}

// Format date for display (YYYY-MM-DD to MMM DD, YYYY)
function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format currency for display
function formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Calculate days between two dates
function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Generate a random ID
function generateId(prefix = '') {
    return prefix + Math.random().toString(36).substring(2, 10);
}

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';

        // Close when clicking on X
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.onclick = function() {
                modal.style.display = 'none';
            };
        }

        // Close when clicking outside the modal
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
}

// Hide modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Show success/error toast notification
function showToast(message, type = 'success') {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast-notification');

    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        document.body.appendChild(toast);
    }

    // Set message and style
    toast.textContent = message;
    toast.className = `toast ${type}`;

    // Show the toast
    toast.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}