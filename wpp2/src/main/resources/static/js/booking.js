// Booking process functionality for CheckInn

// Initialize booking page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the booking page
    if (window.location.pathname.includes('booking.html')) {
        // Check if user is logged in
        if (!isLoggedIn()) {
            // Save current location to redirect back after login
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
            // Redirect to login page
            window.location.href = 'login.html';
            return;
        }

        // Update user information
        updateBookingUserInfo();

        // Setup booking form
        setupBookingForm();

        // Load room data from URL parameter
        loadRoomData();
    }
});

// Update user information on booking page
function updateBookingUserInfo() {
    const user = getCurrentUser();
    if (!user) return;

    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = user.name;
    }

    // Pre-fill guest information if available
    const guestNameInput = document.getElementById('guestName');
    const guestEmailInput = document.getElementById('guestEmail');

    if (guestNameInput && user.name) {
        guestNameInput.value = user.name;
    }

    if (guestEmailInput && user.email) {
        guestEmailInput.value = user.email;
    }
}

// Setup booking form and steps
function setupBookingForm() {
    // Date selection and calculation
    setupDateSelection();

    // Guest count selection
    setupGuestSelection();

    // Payment method toggle
    setupPaymentMethodToggle();

    // Step navigation
    setupStepNavigation();
}

// Setup date selection and calculation
function setupDateSelection() {
    const checkInDate = document.getElementById('checkInDate');
    const checkOutDate = document.getElementById('checkOutDate');
    const summaryCheckIn = document.getElementById('summaryCheckIn');
    const summaryCheckOut = document.getElementById('summaryCheckOut');
    const summaryNights = document.getElementById('summaryNights');
    const summaryTotal = document.getElementById('summaryTotal');

    // Set min dates (today and tomorrow)
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // Format dates for input
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    if (checkInDate && checkOutDate) {
        // Get stored dates from room search if available
        const storedCheckIn = sessionStorage.getItem('checkIn');
        const storedCheckOut = sessionStorage.getItem('checkOut');

        // Set default dates
        checkInDate.min = formatDate(today);
        checkInDate.value = storedCheckIn || formatDate(today);

        checkOutDate.min = formatDate(tomorrow);
        checkOutDate.value = storedCheckOut || formatDate(tomorrow);

        // Update summary initially
        updateDateSummary();

        // Add event listeners for date changes
        checkInDate.addEventListener('change', function() {
            // Ensure check-out is after check-in
            const newCheckIn = new Date(this.value);
            const currentCheckOut = new Date(checkOutDate.value);

            if (newCheckIn >= currentCheckOut) {
                // Set check-out to day after check-in
                const newCheckOut = new Date(newCheckIn);
                newCheckOut.setDate(newCheckIn.getDate() + 1);
                checkOutDate.value = formatDate(newCheckOut);
            }

            // Update min date for checkout
            const minCheckOut = new Date(newCheckIn);
            minCheckOut.setDate(newCheckIn.getDate() + 1);
            checkOutDate.min = formatDate(minCheckOut);

            // Update summary
            updateDateSummary();
        });

        checkOutDate.addEventListener('change', function() {
            // Update summary
            updateDateSummary();
        });
    }

    // Function to update date summary
    function updateDateSummary() {
        if (summaryCheckIn && summaryCheckOut && summaryNights && checkInDate && checkOutDate) {
            const checkIn = new Date(checkInDate.value);
            const checkOut = new Date(checkOutDate.value);

            // Format dates for display
            const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
            summaryCheckIn.textContent = checkIn.toLocaleDateString('en-US', options);
            summaryCheckOut.textContent = checkOut.toLocaleDateString('en-US', options);

            // Calculate nights
            const nights = calculateDays(checkInDate.value, checkOutDate.value);
            summaryNights.textContent = nights;

            // Update total price
            updateTotalPrice(nights);
        }
    }

    // Function to update total price
    function updateTotalPrice(nights) {
        if (summaryTotal) {
            const roomPrice = parseFloat(document.getElementById('roomPrice').innerText.replace('$', ''));
            const total = roomPrice * nights;
            summaryTotal.textContent = formatCurrency(total);

            // Also update confirmation step
            const confirmTotal = document.getElementById('confirmTotal');
            if (confirmTotal) {
                confirmTotal.textContent = formatCurrency(total);
            }
        }
    }
}

// Setup guest selection
function setupGuestSelection() {
    const guestCount = document.getElementById('guestCount');
    const summaryGuests = document.getElementById('summaryGuests');
    const confirmGuests = document.getElementById('confirmGuests');

    if (guestCount && summaryGuests) {
        // Set initial value from session storage if available
        const storedGuests = sessionStorage.getItem('guests');
        if (storedGuests) {
            guestCount.value = storedGuests;
            summaryGuests.textContent = storedGuests;
            if (confirmGuests) confirmGuests.textContent = storedGuests;
        }

        // Update on change
        guestCount.addEventListener('change', function() {
            summaryGuests.textContent = this.value;
            if (confirmGuests) confirmGuests.textContent = this.value;
        });
    }
}

// Setup payment method toggle
function setupPaymentMethodToggle() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const paymentDetails = document.getElementById('paymentDetails');

    if (paymentMethods && paymentDetails) {
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                if (this.value === 'now') {
                    paymentDetails.style.display = 'block';
                } else {
                    paymentDetails.style.display = 'none';
                }
            });
        });
    }
}

// Setup step navigation
function setupStepNavigation() {
    const nextStep1 = document.getElementById('nextStep1');
    const nextStep2 = document.getElementById('nextStep2');
    const prevStep2 = document.getElementById('prevStep2');

    // Step 1 to Step 2
    if (nextStep1) {
        nextStep1.addEventListener('click', function() {
            // Validate dates
            const checkIn = document.getElementById('checkInDate').value;
            const checkOut = document.getElementById('checkOutDate').value;

            if (!checkIn || !checkOut) {
                alert('Please select check-in and check-out dates');
                return;
            }

            if (new Date(checkIn) >= new Date(checkOut)) {
                alert('Check-out date must be after check-in date');
                return;
            }

            // Update progress indicator
            document.querySelectorAll('.progress-step')[0].classList.remove('active');
            document.querySelectorAll('.progress-step')[1].classList.add('active');

            // Hide step 1, show step 2
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'block';
        });
    }

    // Step 2 back to Step 1
    if (prevStep2) {
        prevStep2.addEventListener('click', function() {
            // Update progress indicator
            document.querySelectorAll('.progress-step')[1].classList.remove('active');
            document.querySelectorAll('.progress-step')[0].classList.add('active');

            // Hide step 2, show step 1
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step1').style.display = 'block';
        });
    }

    // Step 2 to Step 3 (Confirmation)
    if (nextStep2) {
        nextStep2.addEventListener('click', function() {
            // Validate required fields
            const guestName = document.getElementById('guestName').value;
            const guestEmail = document.getElementById('guestEmail').value;
            const guestPhone = document.getElementById('guestPhone').value;

            if (!guestName || !guestEmail || !guestPhone) {
                alert('Please fill in all required fields');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(guestEmail)) {
                alert('Please enter a valid email address');
                return;
            }

            // Validate payment if "Pay Now" is selected
            const payNow = document.getElementById('payNow').checked;
            if (payNow) {
                const cardNumber = document.getElementById('cardNumber').value;
                const expiryDate = document.getElementById('expiryDate').value;
                const cvv = document.getElementById('cvv').value;

                if (!cardNumber || !expiryDate || !cvv) {
                    alert('Please fill in all payment details');
                    return;
                }
            }

            // Update confirmation details
            updateConfirmationDetails();

            // Update progress indicator
            document.querySelectorAll('.progress-step')[1].classList.remove('active');
            document.querySelectorAll('.progress-step')[2].classList.add('active');

            // Hide step 2, show step 3
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step3').style.display = 'block';

            // Simulate booking creation
            createBooking();
        });
    }
}

// Update confirmation details
function updateConfirmationDetails() {
    // Generate booking reference
    const bookingRef = 'CHK-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('bookingReference').textContent = bookingRef;

    // Copy room name
    const roomName = document.getElementById('roomName').innerText;
    document.getElementById('confirmRoom').textContent = roomName;

    // Format dates
    const checkIn = new Date(document.getElementById('checkInDate').value);
    const checkOut = new Date(document.getElementById('checkOutDate').value);

    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    document.getElementById('confirmCheckIn').textContent = checkIn.toLocaleDateString('en-US', options);
    document.getElementById('confirmCheckOut').textContent = checkOut.toLocaleDateString('en-US', options);
}

// Load room data from URL parameter
function loadRoomData() {
    // Get room ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');

    if (roomId) {
        // Find room in mock data
        const room = mockRoomsList.find(r => r.id === roomId);

        if (room) {
            // Update room details
            document.getElementById('roomName').innerText = room.roomName;
            document.getElementById('roomDescription').innerText = room.description;
            document.getElementById('roomPrice').innerText = `$${room.price}`;
            document.getElementById('summaryRoom').innerText = room.roomName;
            document.getElementById('confirmRoom').innerText = room.roomName;

            // Create amenities list
            const amenitiesList = document.querySelector('.room-amenities');
            if (amenitiesList) {
                amenitiesList.innerHTML = '';

                room.amenities.forEach(amenity => {
                    const li = document.createElement('li');
                    li.textContent = amenity.charAt(0).toUpperCase() + amenity.slice(1);
                    amenitiesList.appendChild(li);
                });
            }

            // Update max guests in the dropdown
            const guestCountSelect = document.getElementById('guestCount');
            if (guestCountSelect) {
                guestCountSelect.innerHTML = '';

                for (let i = 1; i <= room.maxOccupancy; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = `${i} Guest${i !== 1 ? 's' : ''}`;
                    guestCountSelect.appendChild(option);
                }

                // Select stored value if available
                const storedGuests = sessionStorage.getItem('guests');
                if (storedGuests && parseInt(storedGuests) <= room.maxOccupancy) {
                    guestCountSelect.value = storedGuests;
                    document.getElementById('summaryGuests').textContent = storedGuests;
                    document.getElementById('confirmGuests').textContent = storedGuests;
                } else {
                    // Default to 2 guests or max available
                    const defaultGuests = Math.min(2, room.maxOccupancy);
                    guestCountSelect.value = defaultGuests;
                    document.getElementById('summaryGuests').textContent = defaultGuests;
                    document.getElementById('confirmGuests').textContent = defaultGuests;
                }
            }

            // Update initial summary
            const checkInDate = document.getElementById('checkInDate');
            const checkOutDate = document.getElementById('checkOutDate');

            if (checkInDate && checkOutDate) {
                const nights = calculateDays(checkInDate.value, checkOutDate.value);
                document.getElementById('summaryNights').textContent = nights;

                // Update total price
                const total = room.price * nights;
                document.getElementById('summaryTotal').textContent = formatCurrency(total);
                document.getElementById('confirmTotal').textContent = formatCurrency(total);
            }
        }
    }
}

// Create booking in mock database
function createBooking() {
    // Get form values
    const roomName = document.getElementById('roomName').innerText;
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;
    const guests = document.getElementById('guestCount').value;
    const guestName = document.getElementById('guestName').value;
    const guestEmail = document.getElementById('guestEmail').value;
    const guestPhone = document.getElementById('guestPhone').value;
    const specialRequests = document.getElementById('specialRequests').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // Get room price and calculate total
    const roomPrice = parseFloat(document.getElementById('roomPrice').innerText.replace('$', ''));
    const nights = calculateDays(checkIn, checkOut);
    const totalAmount = roomPrice * nights;

    // Get user information
    const user = getCurrentUser();

    // Create booking object
    const booking = {
        id: 'b' + (new Date().getTime()),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        roomId: new URLSearchParams(window.location.search).get('roomId') || 'r1',
        roomNumber: Math.floor(Math.random() * 500) + 100, // Random room number for demo
        roomName: roomName,
        checkIn: checkIn,
        checkOut: checkOut,
        guests: parseInt(guests),
        status: 'confirmed',
        price: roomPrice,
        totalAmount: totalAmount,
        paymentMethod: paymentMethod === 'now' ? 'Credit Card (**** 1234)' : 'Pay at Property',
        paymentStatus: paymentMethod === 'now' ? 'paid' : 'pending',
        specialRequests: specialRequests,
        createdAt: new Date().toISOString().split('T')[0]
    };

    // In a real app, this would send a request to the backend
    // For now, we'll just store it in local storage

    // Get existing bookings or create empty array
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');

    // Add new booking
    bookings.push(booking);

    // Save back to local storage
    localStorage.setItem('userBookings', JSON.stringify(bookings));

    // Clear session storage
    sessionStorage.removeItem('checkIn');
    sessionStorage.removeItem('checkOut');
    sessionStorage.removeItem('guests');
}