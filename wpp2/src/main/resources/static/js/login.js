// Direct login script - Put this at the end of login.html
// This doesn't communicate with the backend at all

function directLogin() {
    // Get input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check for specific test credentials
    if (username === 'user1' && password === 'user1') {
        // Store user info in localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            id: 'user1',
            name: 'Client User',
            email: 'user1@example.com',
            role: 'CLIENT'
        }));

        // Redirect to client dashboard
        window.location.href = 'client/dashboard.html';
        return false; // Prevent form submission

    } else if (username === 'user2' && password === 'user2') {
        // Store user info in localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            id: 'user2',
            name: 'Admin User',
            email: 'user2@example.com',
            role: 'ADMIN'
        }));

        // Redirect to admin dashboard
        window.location.href = 'admin/dashboard.html';
        return false; // Prevent form submission

    } else {
        // Show error message
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.textContent = 'Invalid username or password. Try user1/user1 or user2/user2';
            errorDiv.style.display = 'block';
        }
        return false; // Prevent form submission
    }
}

