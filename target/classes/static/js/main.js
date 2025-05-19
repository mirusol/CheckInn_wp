/**
 * Main JavaScript file for the CheckInn application
 */

// Automatically fade out alert messages after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    // Find all alerts
    const alerts = document.querySelectorAll('.alert');

    // Set timeout to fade out alerts
    if (alerts.length > 0) {
        setTimeout(function() {
            alerts.forEach(function(alert) {
                // Create fade out effect
                alert.style.transition = 'opacity 1s';
                alert.style.opacity = '0';

                // Remove from DOM after fade completes
                setTimeout(function() {
                    alert.style.display = 'none';
                }, 1000);
            });
        }, 5000);
    }

    // Set date input minimums to today's date
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');

    dateInputs.forEach(function(input) {
        // Only set min attribute if it's not already set
        if (!input.hasAttribute('min')) {
            input.setAttribute('min', today);
        }
    });

    // Setup check-in/check-out date logic
    setupDateLogic();
});

/**
 * Sets up logic between check-in and check-out date inputs
 */
function setupDateLogic() {
    const checkInInputs = document.querySelectorAll('input[id*="checkIn"]');
    const checkOutInputs = document.querySelectorAll('input[id*="checkOut"]');

    // Match each check-in with its corresponding check-out input
    checkInInputs.forEach(function(checkInInput) {
        const formGroup = checkInInput.closest('form');
        if (!formGroup) return;

        const checkOutInput = formGroup.querySelector('input[id*="checkOut"]');
        if (!checkOutInput) return;

        // When check-in date changes, update check-out minimum
        checkInInput.addEventListener('change', function() {
            checkOutInput.min = this.value;

            // If check-out is before check-in, update it
            if (checkOutInput.value < this.value) {
                checkOutInput.value = this.value;
            }

            // If there's a price calculator function, call it
            if (typeof calculatePrice === 'function') {
                calculatePrice();
            }
        });

        // When check-out date changes, call price calculator if available
        checkOutInput.addEventListener('change', function() {
            if (typeof calculatePrice === 'function') {
                calculatePrice();
            }
        });
    });
}

/**
 * Confirms an action before proceeding
 * @param {string} message - The confirmation message
 * @returns {boolean} - True if confirmed, false otherwise
 */
function confirmAction(message) {
    return confirm(message || 'Are you sure you want to proceed?');
}