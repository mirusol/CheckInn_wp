// Room listing and filtering functionality for CheckInn

// Mock rooms data
const mockRoomsList = [
    {
        id: 'r1',
        roomNumber: '101',
        roomType: 'deluxe',
        roomName: 'Deluxe Suite',
        price: 199,
        maxOccupancy: 2,
        description: 'Spacious suite with ocean view and king-size bed',
        amenities: ['wifi', 'ac', 'tv', 'minibar', 'balcony'],
        images: [],
        status: 'available'
    },
    {
        id: 'r2',
        roomNumber: '205',
        roomType: 'standard',
        roomName: 'Standard Room',
        price: 129,
        maxOccupancy: 2,
        description: 'Comfortable room with city view and queen-size bed',
        amenities: ['wifi', 'ac', 'tv'],
        images: [],
        status: 'available'
    },
    {
        id: 'r3',
        roomNumber: '310',
        roomType: 'apartment',
        roomName: 'Premium Apartment',
        price: 259,
        maxOccupancy: 4,
        description: 'Luxury apartment with separate living room and kitchen',
        amenities: ['wifi', 'ac', 'tv', 'minibar', 'balcony', 'kitchen'],
        images: [],
        status: 'available'
    },
    {
        id: 'r4',
        roomNumber: '402',
        roomType: 'suite',
        roomName: 'Executive Suite',
        price: 229,
        maxOccupancy: 2,
        description: 'Elegant suite with panoramic views and lounge area',
        amenities: ['wifi', 'ac', 'tv', 'minibar'],
        images: [],
        status: 'available'
    },
    {
        id: 'r5',
        roomNumber: '207',
        roomType: 'standard',
        roomName: 'Standard Room',
        price: 129,
        maxOccupancy: 2,
        description: 'Comfortable room with park view and queen-size bed',
        amenities: ['wifi', 'ac', 'tv'],
        images: [],
        status: 'available'
    },
    {
        id: 'r6',
        roomNumber: '315',
        roomType: 'apartment',
        roomName: 'Family Apartment',
        price: 299,
        maxOccupancy: 6,
        description: 'Spacious apartment with two bedrooms and full kitchen',
        amenities: ['wifi', 'ac', 'tv', 'minibar', 'balcony', 'kitchen'],
        images: [],
        status: 'available'
    },
    {
        id: 'r7',
        roomNumber: '108',
        roomType: 'deluxe',
        roomName: 'Deluxe Garden Room',
        price: 179,
        maxOccupancy: 2,
        description: 'Deluxe room with private garden access',
        amenities: ['wifi', 'ac', 'tv', 'minibar'],
        images: [],
        status: 'available'
    },
    {
        id: 'r8',
        roomNumber: '420',
        roomType: 'suite',
        roomName: 'Penthouse Suite',
        price: 399,
        maxOccupancy: 4,
        description: 'Luxurious penthouse suite with private terrace and hot tub',
        amenities: ['wifi', 'ac', 'tv', 'minibar', 'balcony', 'jacuzzi'],
        images: [],
        status: 'available'
    }
];

// Initialize room functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the rooms page
    if (window.location.pathname.includes('rooms.html')) {
        // Setup search and filter
        setupRoomSearch();

        // Load all available rooms
        loadAvailableRooms();

        // Update UI based on authentication status
        updateRoomsAuthUI();
    }
});

// Update rooms UI based on authentication status
function updateRoomsAuthUI() {
    const authSection = document.getElementById('authSection');
    if (!authSection) return;

    const isUserLoggedIn = isLoggedIn();

    if (isUserLoggedIn) {
        const user = getCurrentUser();

        authSection.innerHTML = `
            <div class="user-menu">
                <span>${user.name}</span>
                <button id="logout-btn" onclick="logout()">Logout</button>
            </div>
        `;
    } else {
        authSection.innerHTML = `
            <a href="login.html" class="btn-secondary">Login</a>
            <a href="register.html" class="btn-primary">Register</a>
        `;
    }
}

// Setup room search and filter
function setupRoomSearch() {
    // Search button
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            // Get search parameters
            const checkIn = document.getElementById('checkIn').value;
            const checkOut = document.getElementById('checkOut').value;
            const guests = document.getElementById('guests').value;

            // Validate dates
            if (checkIn && checkOut) {
                if (new Date(checkIn) >= new Date(checkOut)) {
                    alert('Check-out date must be after check-in date');
                    return;
                }
            }

            // Store search parameters in session storage
            sessionStorage.setItem('checkIn', checkIn);
            sessionStorage.setItem('checkOut', checkOut);
            sessionStorage.setItem('guests', guests);

            // Filter rooms based on occupancy
            const filteredRooms = mockRoomsList.filter(room => room.maxOccupancy >= parseInt(guests));

            // Re-render rooms list
            renderRooms(filteredRooms);
        });
    }

    // Filter options
    const priceRange = document.getElementById('priceRange');
    const roomType = document.getElementById('roomType');
    const amenities = document.getElementById('amenities');

    // Apply filters when changed
    if (priceRange) {
        priceRange.addEventListener('change', applyFilters);
    }

    if (roomType) {
        roomType.addEventListener('change', applyFilters);
    }

    if (amenities) {
        amenities.addEventListener('change', applyFilters);
    }
}

// Apply all filters
function applyFilters() {
    // Get filter values
    const priceRange = document.getElementById('priceRange').value;
    const roomType = document.getElementById('roomType').value;
    const amenities = document.getElementById('amenities').value;
    const guests = document.getElementById('guests').value || '2';

    // Start with all available rooms
    let filteredRooms = [...mockRoomsList].filter(room => room.status === 'available');

    // Filter by occupancy
    filteredRooms = filteredRooms.filter(room => room.maxOccupancy >= parseInt(guests));

    // Filter by price range
    if (priceRange !== 'all') {
        switch(priceRange) {
            case 'budget':
                filteredRooms = filteredRooms.filter(room => room.price >= 50 && room.price <= 100);
                break;
            case 'standard':
                filteredRooms = filteredRooms.filter(room => room.price > 100 && room.price <= 200);
                break;
            case 'luxury':
                filteredRooms = filteredRooms.filter(room => room.price > 200);
                break;
        }
    }

    // Filter by room type
    if (roomType !== 'all') {
        filteredRooms = filteredRooms.filter(room => room.roomType === roomType);
    }

    // Filter by amenities
    if (amenities !== 'all') {
        filteredRooms = filteredRooms.filter(room => room.amenities.includes(amenities));
    }

    // Render filtered rooms
    renderRooms(filteredRooms);
}

// Load all available rooms
function loadAvailableRooms() {
    // Get only available rooms
    const availableRooms = mockRoomsList.filter(room => room.status === 'available');

    // Render rooms
    renderRooms(availableRooms);

    // Set default dates if not already set
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');

    if (checkIn && checkOut) {
        // Get today and tomorrow dates
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

        // Set default dates if not already set
        if (!checkIn.value) {
            checkIn.value = formatDate(today);
        }

        if (!checkOut.value) {
            checkOut.value = formatDate(tomorrow);
        }

        // Set min dates to prevent selecting past dates
        checkIn.min = formatDate(today);
        checkOut.min = formatDate(tomorrow);
    }
}

// Render rooms to the room list
function renderRooms(rooms) {
    const roomsList = document.getElementById('roomsList');
    if (!roomsList) return;

    // Clear loading message
    roomsList.innerHTML = '';

    if (rooms.length === 0) {
        roomsList.innerHTML = `
            <div class="empty-message">
                <p>No rooms found matching your criteria.</p>
                <p>Try adjusting your filters or dates.</p>
            </div>
        `;
        return;
    }

    // Create room cards
    rooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';

        // Create amenities icons
        const amenitiesIcons = room.amenities.map(amenity => {
            let icon = '';
            let label = '';

            switch(amenity) {
                case 'wifi':
                    icon = '📶';
                    label = 'Free WiFi';
                    break;
                case 'ac':
                    icon = '❄️';
                    label = 'Air Conditioning';
                    break;
                case 'tv':
                    icon = '📺';
                    label = 'TV';
                    break;
                case 'minibar':
                    icon = '🍹';
                    label = 'Minibar';
                    break;
                case 'balcony':
                    icon = '🏞️';
                    label = 'Balcony';
                    break;
                case 'kitchen':
                    icon = '🍳';
                    label = 'Kitchen';
                    break;
                case 'jacuzzi':
                    icon = '♨️';
                    label = 'Jacuzzi';
                    break;
                default:
                    icon = '✓';
                    label = amenity;
                    break;
            }

            return `<span class="amenity-icon" title="${label}">${icon}</span>`;
        }).slice(0, 4).join(''); // Show only first 4 amenities

        // Add "+X more" if there are more amenities
        const moreAmenities = room.amenities.length > 4 ?
            `<span class="more-amenities">+${room.amenities.length - 4} more</span>` : '';

        roomCard.innerHTML = `
            <div class="room-image placeholder-image"></div>
            <div class="room-details">
                <div class="room-header">
                    <h3>${room.roomName}</h3>
                    <div class="room-price">${formatCurrency(room.price)}<span>/night</span></div>
                </div>
                <p class="room-description">${room.description}</p>
                <div class="room-amenities">
                    ${amenitiesIcons}
                    ${moreAmenities}
                </div>
                <div class="room-capacity">
                    <span>Max Guests: ${room.maxOccupancy}</span>
                </div>
                <div class="room-actions">
                    <button class="btn-secondary" onclick="viewRoomDetails('${room.id}')">Details</button>
                    <a href="booking.html?roomId=${room.id}" class="btn-primary">Book Now</a>
                </div>
            </div>
        `;

        roomsList.appendChild(roomCard);
    });
}

// View room details function (would open a modal in full implementation)
function viewRoomDetails(roomId) {
    const room = mockRoomsList.find(r => r.id === roomId);
    if (!room) return;

    alert(`
Room Details:
${room.roomName} (Room ${room.roomNumber})
${room.description}
Price: ${formatCurrency(room.price)} per night
Max Occupancy: ${room.maxOccupancy} guests
Amenities: ${room.amenities.join(', ')}

This is just a demo. 
    `);
}

