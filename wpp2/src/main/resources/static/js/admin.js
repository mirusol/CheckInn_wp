// Admin functionality for CheckInn

// Mock users data
const mockAdminUsers = [
    {
        id: 'u1',
        name: 'Admin User',
        email: 'admin@checkinn.com',
        password: 'admin123',
        role: 'ADMIN',
        registeredDate: '2024-01-15',
        status: 'active'
    },
    {
        id: 'u2',
        name: 'Client User',
        email: 'client@checkinn.com',
        password: 'client123',
        role: 'CLIENT',
        registeredDate: '2024-02-20',
        status: 'active'
    },
    {
        id: 'u3',
        name: 'John Smith',
        email: 'john@example.com',
        password: 'password123',
        role: 'CLIENT',
        registeredDate: '2024-03-05',
        status: 'active'
    },
    {
        id: 'u4',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'CLIENT',
        registeredDate: '2024-03-12',
        status: 'active'
    },
    {
        id: 'u5',
        name: 'Michael Brown',
        email: 'michael@example.com',
        password: 'password123',
        role: 'CLIENT',
        registeredDate: '2024-03-18',
        status: 'inactive'
    }
];

// Mock rooms data
const mockRooms = [
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
        amenities: ['wifi', 'ac', 'tv', 'minibar', 'balcony'],
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
        status: 'maintenance'
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
        status: 'occupied'
    }
];

// Mock bookings data
const mockAdminBookings = [
    {
        id: 'b1',
        userId: 'u2',
        userName: 'Client User',
        userEmail: 'client@checkinn.com',
        roomId: 'r1',
        roomNumber: '101',
        roomName: 'Deluxe Suite',
        checkIn: '2025-05-15',
        checkOut: '2025-05-18',
        guests: 2,
        status: 'confirmed',
        price: 199,
        totalAmount: 597,
        paymentMethod: 'Credit Card (**** 1234)',
        paymentStatus: 'paid',
        specialRequests: 'Late check-in, around 10 PM.',
        createdAt: '2025-04-20'
    },
    {
        id: 'b2',
        userId: 'u2',
        userName: 'Client User',
        userEmail: 'client@checkinn.com',
        roomId: 'r2',
        roomNumber: '205',
        roomName: 'Standard Room',
        checkIn: '2025-06-20',
        checkOut: '2025-06-22',
        guests: 1,
        status: 'confirmed',
        price: 129,
        totalAmount: 258,
        paymentMethod: 'Pay at Property',
        paymentStatus: 'pending',
        specialRequests: '',
        createdAt: '2025-04-22'
    },
    {
        id: 'b3',
        userId: 'u3',
        userName: 'John Smith',
        userEmail: 'john@example.com',
        roomId: 'r3',
        roomNumber: '310',
        roomName: 'Premium Apartment',
        checkIn: '2025-05-10',
        checkOut: '2025-05-15',
        guests: 3,
        status: 'confirmed',
        price: 259,
        totalAmount: 1295,
        paymentMethod: 'Credit Card (**** 5678)',
        paymentStatus: 'paid',
        specialRequests: 'Extra towels please.',
        createdAt: '2025-04-25'
    },
    {
        id: 'b4',
        userId: 'u4',
        userName: 'Sarah Johnson',
        userEmail: 'sarah@example.com',
        roomId: 'r1',
        roomNumber: '101',
        roomName: 'Deluxe Suite',
        checkIn: '2025-04-02',
        checkOut: '2025-04-05',
        guests: 2,
        status: 'completed',
        price: 199,
        totalAmount: 597,
        paymentMethod: 'Credit Card (**** 9012)',
        paymentStatus: 'paid',
        specialRequests: '',
        createdAt: '2025-03-15'
    },
    {
        id: 'b5',
        userId: 'u5',
        userName: 'Michael Brown',
        userEmail: 'michael@example.com',
        roomId: 'r2',
        roomNumber: '207',
        roomName: 'Standard Room',
        checkIn: '2025-03-20',
        checkOut: '2025-03-22',
        guests: 1,
        status: 'cancelled',
        price: 129,
        totalAmount: 258,
        paymentMethod: 'Credit Card (**** 3456)',
        paymentStatus: 'refunded',
        specialRequests: '',
        createdAt: '2025-02-28'
    }
];

// Initialize admin functionality
document.addEventListener('DOMContentLoaded', function() {
    // Protect all admin pages
    if (window.location.pathname.includes('/admin/')) {
        if (!protectRoute()) return;
        if (!checkRole(['ADMIN'])) return;

        // Update admin name in header
        updateAdminHeader();
    }

    // Initialize specific admin pages
    const path = window.location.pathname;

    if (path.includes('/admin/dashboard.html')) {
        initAdminDashboard();
    } else if (path.includes('/admin/users.html')) {
        initAdminUsers();
    } else if (path.includes('/admin/rooms.html')) {
        initAdminRooms();
    }

    // Setup admin UI interactions
    setupAdminUIInteractions();
});

// Update admin header with user information
function updateAdminHeader() {
    const user = getCurrentUser();
    if (!user) return;

    const adminName = document.getElementById('admin-name');

    if (adminName) {
        adminName.textContent = user.name;
    }
}

// Initialize admin dashboard
function initAdminDashboard() {
    // Load recent bookings
    loadRecentBookings();

    // Load recent users
    loadRecentUsers();
}

// Load recent bookings for dashboard
function loadRecentBookings() {
    const recentBookingsList = document.getElementById('recentBookingsList');
    if (!recentBookingsList) return;

    // Sort bookings by creation date, most recent first
    const recentBookings = [...mockAdminBookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5); // Show only last 5 bookings

    recentBookingsList.innerHTML = '';

    recentBookings.forEach(booking => {
        const row = document.createElement('tr');

        // Determine status class
        let statusClass = '';
        switch(booking.status) {
            case 'confirmed': statusClass = 'status-confirmed'; break;
            case 'completed': statusClass = 'status-completed'; break;
            case 'cancelled': statusClass = 'status-cancelled'; break;
        }

        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.userName}</td>
            <td>${booking.roomName}</td>
            <td>${formatDate(booking.checkIn)}</td>
            <td><span class="status-badge ${statusClass}">${booking.status}</span></td>
            <td>${formatCurrency(booking.totalAmount)}</td>
        `;

        recentBookingsList.appendChild(row);
    });
}

// Load recent users for dashboard
function loadRecentUsers() {
    const recentUsersList = document.getElementById('recentUsersList');
    if (!recentUsersList) return;

    // Sort users by registration date, most recent first
    const recentUsers = [...mockAdminUsers]
        .sort((a, b) => new Date(b.registeredDate) - new Date(a.registeredDate))
        .slice(0, 5); // Show only last 5 users

    recentUsersList.innerHTML = '';

    recentUsers.forEach(user => {
        const row = document.createElement('tr');

        // Determine status class
        const statusClass = user.status === 'active' ? 'status-active' : 'status-inactive';

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${formatDate(user.registeredDate)}</td>
            <td><span class="status-badge ${statusClass}">${user.status}</span></td>
        `;

        recentUsersList.appendChild(row);
    });
}

// Initialize admin users page
function initAdminUsers() {
    // Load all users
    loadAllUsers();

    // Setup filter and search
    setupUserFilters();

    // Setup modals
    setupUserModals();
}

// Load all users for admin users page
function loadAllUsers(filter = 'all', status = 'all') {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;

    // Filter users based on role and status
    let filteredUsers = [...mockAdminUsers];

    if (filter !== 'all') {
        filteredUsers = filteredUsers.filter(user =>
            user.role === filter.toUpperCase()
        );
    }

    if (status !== 'all') {
        filteredUsers = filteredUsers.filter(user =>
            user.status === status.toLowerCase()
        );
    }

    // Sort users by registration date, most recent first
    filteredUsers.sort((a, b) => new Date(b.registeredDate) - new Date(a.registeredDate));

    usersList.innerHTML = '';

    filteredUsers.forEach(user => {
        const row = document.createElement('tr');

        // Determine status class
        const statusClass = user.status === 'active' ? 'status-active' : 'status-inactive';

        row.innerHTML = `
            <td><input type="checkbox" class="user-checkbox" data-id="${user.id}"></td>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${formatDate(user.registeredDate)}</td>
            <td><span class="status-badge ${statusClass}">${user.status}</span></td>
            <td>
                <button class="icon-btn edit-btn" onclick="editUser('${user.id}')">✏️</button>
                <button class="icon-btn delete-btn" onclick="deleteUser('${user.id}')">🗑️</button>
            </td>
        `;

        usersList.appendChild(row);
    });
}

// Setup user filters and search
function setupUserFilters() {
    const roleFilter = document.getElementById('userRoleFilter');
    const statusFilter = document.getElementById('userStatusFilter');
    const searchInput = document.getElementById('userSearch');
    const searchBtn = document.getElementById('searchBtn');

    if (roleFilter) {
        roleFilter.addEventListener('change', function() {
            const role = this.value;
            const status = statusFilter ? statusFilter.value : 'all';
            loadAllUsers(role, status);
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const status = this.value;
            const role = roleFilter ? roleFilter.value : 'all';
            loadAllUsers(role, status);
        });
    }

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchUsers(searchInput.value);
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchUsers(this.value);
            }
        });
    }

    // Select all users checkbox
    const selectAllCheckbox = document.getElementById('selectAllUsers');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.user-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
}

// Search users
function searchUsers(searchTerm) {
    if (!searchTerm) {
        // If empty, reload with current filters
        const roleFilter = document.getElementById('userRoleFilter');
        const statusFilter = document.getElementById('userStatusFilter');
        const role = roleFilter ? roleFilter.value : 'all';
        const status = statusFilter ? statusFilter.value : 'all';

        loadAllUsers(role, status);
        return;
    }

    searchTerm = searchTerm.toLowerCase();

    const filteredUsers = mockAdminUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.id.toLowerCase().includes(searchTerm)
    );

    const usersList = document.getElementById('usersList');
    if (!usersList) return;

    usersList.innerHTML = '';

    if (filteredUsers.length === 0) {
        usersList.innerHTML = `
            <tr>
                <td colspan="8" class="empty-message">No users found matching "${searchTerm}"</td>
            </tr>
        `;
        return;
    }

    filteredUsers.forEach(user => {
        const row = document.createElement('tr');

        // Determine status class
        const statusClass = user.status === 'active' ? 'status-active' : 'status-inactive';

        row.innerHTML = `
            <td><input type="checkbox" class="user-checkbox" data-id="${user.id}"></td>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${formatDate(user.registeredDate)}</td>
            <td><span class="status-badge ${statusClass}">${user.status}</span></td>
            <td>
                <button class="icon-btn edit-btn" onclick="editUser('${user.id}')">✏️</button>
                <button class="icon-btn delete-btn" onclick="deleteUser('${user.id}')">🗑️</button>
            </td>
        `;

        usersList.appendChild(row);
    });
}

// Setup user modals
function setupUserModals() {
    // Add user button
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            showModal('addUserModal');
        });
    }

    // Add user form submission
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const userRole = document.getElementById('userRole').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validation
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            // Check if email already exists
            if (mockAdminUsers.some(u => u.email === email)) {
                alert('Email already registered');
                return;
            }

            // Create new user
            const newUser = {
                id: 'u' + (mockAdminUsers.length + 1),
                name: fullName,
                email: email,
                password: password,
                role: userRole.toUpperCase(),
                registeredDate: new Date().toISOString().split('T')[0],
                status: 'active'
            };

            // Add to mock users
            mockAdminUsers.push(newUser);

            // Reload users list
            const roleFilter = document.getElementById('userRoleFilter');
            const statusFilter = document.getElementById('userStatusFilter');
            const role = roleFilter ? roleFilter.value : 'all';
            const status = statusFilter ? statusFilter.value : 'all';

            loadAllUsers(role, status);

            // Hide modal
            hideModal('addUserModal');

            // Reset form
            addUserForm.reset();

            // Show success message
            showToast('User added successfully', 'success');
        });
    }

    // Cancel add user
    const cancelAddUser = document.getElementById('cancelAddUser');
    if (cancelAddUser) {
        cancelAddUser.addEventListener('click', function() {
            hideModal('addUserModal');
        });
    }

    // Cancel edit user
    const cancelEditUser = document.getElementById('cancelEditUser');
    if (cancelEditUser) {
        cancelEditUser.addEventListener('click', function() {
            hideModal('editUserModal');
        });
    }

    // Edit user form submission
    const editUserForm = document.getElementById('editUserForm');
    if (editUserForm) {
        editUserForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const userId = document.getElementById('editUserId').value;
            const fullName = document.getElementById('editFullName').value;
            const email = document.getElementById('editEmail').value;
            const userRole = document.getElementById('editUserRole').value;
            const userStatus = document.getElementById('editUserStatus').value;
            const password = document.getElementById('editPassword').value;

            // Find user
            const userIndex = mockAdminUsers.findIndex(u => u.id === userId);
            if (userIndex === -1) {
                alert('User not found');
                return;
            }

            // Check if email already exists (except for this user)
            if (mockAdminUsers.some(u => u.email === email && u.id !== userId)) {
                alert('Email already registered by another user');
                return;
            }

            // Update user
            mockAdminUsers[userIndex].name = fullName;
            mockAdminUsers[userIndex].email = email;
            mockAdminUsers[userIndex].role = userRole.toUpperCase();
            mockAdminUsers[userIndex].status = userStatus.toLowerCase();

            // Update password if provided
            if (password.trim() !== '') {
                mockAdminUsers[userIndex].password = password;
            }

            // Reload users list
            const roleFilter = document.getElementById('userRoleFilter');
            const statusFilter = document.getElementById('userStatusFilter');
            const role = roleFilter ? roleFilter.value : 'all';
            const status = statusFilter ? statusFilter.value : 'all';

            loadAllUsers(role, status);

            // Hide modal
            hideModal('editUserModal');

            // Show success message
            showToast('User updated successfully', 'success');
        });
    }
}

// Initialize admin rooms page
function initAdminRooms() {
    // Load all rooms
    loadAllRooms();

    // Setup filter and search
    setupRoomFilters();

    // Setup modals
    setupRoomModals();
}

// Load all rooms for admin rooms page
function loadAllRooms(filter = 'all', status = 'all') {
    const roomsGrid = document.getElementById('roomsGrid');
    if (!roomsGrid) return;

    // Filter rooms based on type and status
    let filteredRooms = [...mockRooms];

    if (filter !== 'all') {
        filteredRooms = filteredRooms.filter(room =>
            room.roomType === filter.toLowerCase()
        );
    }

    if (status !== 'all') {
        filteredRooms = filteredRooms.filter(room =>
            room.status === status.toLowerCase()
        );
    }

    roomsGrid.innerHTML = '';

    if (filteredRooms.length === 0) {
        roomsGrid.innerHTML = `
            <div class="empty-message">No rooms found matching the selected criteria.</div>
        `;
        return;
    }

    filteredRooms.forEach(room => {
        // Create room card
        const roomCard = document.createElement('div');
        roomCard.className = 'admin-room-card';

        // Determine status class
        let statusClass = '';
        switch(room.status) {
            case 'available': statusClass = 'status-available'; break;
            case 'occupied': statusClass = 'status-occupied'; break;
            case 'maintenance': statusClass = 'status-maintenance'; break;
        }

        // Create amenities list
        const amenitiesList = room.amenities.map(amenity => {
            let icon = '';
            switch(amenity) {
                case 'wifi': icon = '📶'; break;
                case 'ac': icon = '❄️'; break;
                case 'tv': icon = '📺'; break;
                case 'minibar': icon = '🍹'; break;
                case 'balcony': icon = '🏞️'; break;
                default: icon = '✓'; break;
            }
            return `<span class="amenity-item">${icon} ${amenity}</span>`;
        }).join('');

        roomCard.innerHTML = `
            <div class="room-card-header">
                <div class="room-number">Room ${room.roomNumber}</div>
                <div class="status-badge ${statusClass}">${room.status}</div>
            </div>
            <div class="room-card-image placeholder-image"></div>
            <div class="room-card-content">
                <h3>${room.roomName}</h3>
                <div class="room-type">${room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)}</div>
                <div class="room-price">${formatCurrency(room.price)} / night</div>
                <div class="room-occupancy">Max Occupancy: ${room.maxOccupancy}</div>
                <p class="room-description">${room.description}</p>
                <div class="room-amenities">
                    ${amenitiesList}
                </div>
            </div>
            <div class="room-card-actions">
                <button class="btn-secondary" onclick="editRoom('${room.id}')">Edit</button>
                <button class="btn-secondary danger" onclick="deleteRoom('${room.id}')">Delete</button>
            </div>
        `;

        roomsGrid.appendChild(roomCard);
    });
}

// Setup room filters and search
function setupRoomFilters() {
    const typeFilter = document.getElementById('roomTypeFilter');
    const statusFilter = document.getElementById('roomStatusFilter');
    const searchInput = document.getElementById('roomSearch');
    const searchBtn = document.getElementById('searchBtn');

    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            const type = this.value;
            const status = statusFilter ? statusFilter.value : 'all';
            loadAllRooms(type, status);
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const status = this.value;
            const type = typeFilter ? typeFilter.value : 'all';
            loadAllRooms(type, status);
        });
    }

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchRooms(searchInput.value);
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchRooms(this.value);
            }
        });
    }
}

// Search rooms
function searchRooms(searchTerm) {
    if (!searchTerm) {
        // If empty, reload with current filters
        const typeFilter = document.getElementById('roomTypeFilter');
        const statusFilter = document.getElementById('roomStatusFilter');
        const type = typeFilter ? typeFilter.value : 'all';
        const status = statusFilter ? statusFilter.value : 'all';

        loadAllRooms(type, status);
        return;
    }

    searchTerm = searchTerm.toLowerCase();

    const filteredRooms = mockRooms.filter(room =>
        room.roomName.toLowerCase().includes(searchTerm) ||
        room.roomNumber.includes(searchTerm) ||
        room.description.toLowerCase().includes(searchTerm) ||
        room.roomType.toLowerCase().includes(searchTerm)
    );

    const roomsGrid = document.getElementById('roomsGrid');
    if (!roomsGrid) return;

    roomsGrid.innerHTML = '';

    if (filteredRooms.length === 0) {
        roomsGrid.innerHTML = `
            <div class="empty-message">No rooms found matching "${searchTerm}"</div>
        `;
        return;
    }

    filteredRooms.forEach(room => {
        // Create room card (same code as in loadAllRooms)
        const roomCard = document.createElement('div');
        roomCard.className = 'admin-room-card';

        // Determine status class
        let statusClass = '';
        switch(room.status) {
            case 'available': statusClass = 'status-available'; break;
            case 'occupied': statusClass = 'status-occupied'; break;
            case 'maintenance': statusClass = 'status-maintenance'; break;
        }

        // Create amenities list
        const amenitiesList = room.amenities.map(amenity => {
            let icon = '';
            switch(amenity) {
                case 'wifi': icon = '📶'; break;
                case 'ac': icon = '❄️'; break;
                case 'tv': icon = '📺'; break;
                case 'minibar': icon = '🍹'; break;
                case 'balcony': icon = '🏞️'; break;
                default: icon = '✓'; break;
            }
            return `<span class="amenity-item">${icon} ${amenity}</span>`;
        }).join('');

        roomCard.innerHTML = `
            <div class="room-card-header">
                <div class="room-number">Room ${room.roomNumber}</div>
                <div class="status-badge ${statusClass}">${room.status}</div>
            </div>
            <div class="room-card-image placeholder-image"></div>
            <div class="room-card-content">
                <h3>${room.roomName}</h3>
                <div class="room-type">${room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)}</div>
                <div class="room-price">${formatCurrency(room.price)} / night</div>
                <div class="room-occupancy">Max Occupancy: ${room.maxOccupancy}</div>
                <p class="room-description">${room.description}</p>
                <div class="room-amenities">
                    ${amenitiesList}
                </div>
            </div>
            <div class="room-card-actions">
                <button class="btn-secondary" onclick="editRoom('${room.id}')">Edit</button>
                <button class="btn-secondary danger" onclick="deleteRoom('${room.id}')">Delete</button>
            </div>
        `;

        roomsGrid.appendChild(roomCard);
    });
}

// Setup room modals
function setupRoomModals() {
    // Add room button
    const addRoomBtn = document.getElementById('addRoomBtn');
    if (addRoomBtn) {
        addRoomBtn.addEventListener('click', function() {
            showModal('addRoomModal');
        });
    }

    // Cancel add room
    const cancelAddRoom = document.getElementById('cancelAddRoom');
    if (cancelAddRoom) {
        cancelAddRoom.addEventListener('click', function() {
            hideModal('addRoomModal');
        });
    }

    // Cancel edit room
    const cancelEditRoom = document.getElementById('cancelEditRoom');
    if (cancelEditRoom) {
        cancelEditRoom.addEventListener('click', function() {
            hideModal('editRoomModal');
        });
    }

    // Add room form submission
    const addRoomForm = document.getElementById('addRoomForm');
    if (addRoomForm) {
        addRoomForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const roomNumber = document.getElementById('roomNumber').value;
            const roomType = document.getElementById('roomType').value;
            const roomPrice = parseFloat(document.getElementById('roomPrice').value);
            const maxOccupancy = parseInt(document.getElementById('maxOccupancy').value);
            const roomDescription = document.getElementById('roomDescription').value;
            const roomStatus = document.getElementById('roomStatus').value;

            // Get selected amenities
            const amenities = [];
            document.querySelectorAll('input[name="amenities"]:checked').forEach(checkbox => {
                amenities.push(checkbox.value);
            });

            // Check if room number already exists
            if (mockRooms.some(r => r.roomNumber === roomNumber)) {
                alert('Room number already exists');
                return;
            }

            // Determine room name based on type
            let roomName = '';
            switch(roomType) {
                case 'standard': roomName = 'Standard Room'; break;
                case 'deluxe': roomName = 'Deluxe Room'; break;
                case 'suite': roomName = 'Suite'; break;
                case 'apartment': roomName = 'Apartment'; break;
                default: roomName = 'Room'; break;
            }

            // Create new room
            const newRoom = {
                id: 'r' + (mockRooms.length + 1),
                roomNumber: roomNumber,
                roomType: roomType,
                roomName: roomName,
                price: roomPrice,
                maxOccupancy: maxOccupancy,
                description: roomDescription,
                amenities: amenities,
                images: [],
                status: roomStatus
            };

            // Add to mock rooms
            mockRooms.push(newRoom);

            // Reload rooms list
            const typeFilter = document.getElementById('roomTypeFilter');
            const statusFilter = document.getElementById('roomStatusFilter');
            const type = typeFilter ? typeFilter.value : 'all';
            const status = statusFilter ? statusFilter.value : 'all';

            loadAllRooms(type, status);

            // Hide modal
            hideModal('addRoomModal');

            // Reset form
            addRoomForm.reset();

            // Show success message
            showToast('Room added successfully', 'success');
        });
    }

    // Edit room form submission
    const editRoomForm = document.getElementById('editRoomForm');
    if (editRoomForm) {
        editRoomForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const roomId = document.getElementById('editRoomId').value;
            const roomNumber = document.getElementById('editRoomNumber').value;
            const roomType = document.getElementById('editRoomType').value;
            const roomPrice = parseFloat(document.getElementById('editRoomPrice').value);
            const maxOccupancy = parseInt(document.getElementById('editMaxOccupancy').value);
            const roomDescription = document.getElementById('editRoomDescription').value;
            const roomStatus = document.getElementById('editRoomStatus').value;

            // Get selected amenities
            const amenities = [];
            document.querySelectorAll('input[name="editAmenities"]:checked').forEach(checkbox => {
                amenities.push(checkbox.value);
            });

            // Find room
            const roomIndex = mockRooms.findIndex(r => r.id === roomId);
            if (roomIndex === -1) {
                alert('Room not found');
                return;
            }

            // Check if room number already exists (except for this room)
            if (mockRooms.some(r => r.roomNumber === roomNumber && r.id !== roomId)) {
                alert('Room number already exists');
                return;
            }

            // Determine room name based on type
            let roomName = '';
            switch(roomType) {
                case 'standard': roomName = 'Standard Room'; break;
                case 'deluxe': roomName = 'Deluxe Room'; break;
                case 'suite': roomName = 'Suite'; break;
                case 'apartment': roomName = 'Apartment'; break;
                default: roomName = 'Room'; break;
            }

            // Update room
            mockRooms[roomIndex].roomNumber = roomNumber;
            mockRooms[roomIndex].roomType = roomType;
            mockRooms[roomIndex].roomName = roomName;
            mockRooms[roomIndex].price = roomPrice;
            mockRooms[roomIndex].maxOccupancy = maxOccupancy;
            mockRooms[roomIndex].description = roomDescription;
            mockRooms[roomIndex].amenities = amenities;
            mockRooms[roomIndex].status = roomStatus;

            // Reload rooms list
            const typeFilter = document.getElementById('roomTypeFilter');
            const statusFilter = document.getElementById('roomStatusFilter');
            const type = typeFilter ? typeFilter.value : 'all';
            const status = statusFilter ? statusFilter.value : 'all';

            loadAllRooms(type, status);

            // Hide modal
            hideModal('editRoomModal');

            // Show success message
            showToast('Room updated successfully', 'success');
        });
    }
}

// Edit user function
function editUser(userId) {
    const user = mockAdminUsers.find(u => u.id === userId);
    if (!user) {
        alert('User not found');
        return;
    }

    // Populate edit user form
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editFullName').value = user.name;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editUserRole').value = user.role.toLowerCase();
    document.getElementById('editUserStatus').value = user.status;
    document.getElementById('editPassword').value = '';

    // Show modal
    showModal('editUserModal');
}

// Delete user function
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        const userIndex = mockAdminUsers.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            mockAdminUsers.splice(userIndex, 1);

            // Reload users list
            const roleFilter = document.getElementById('userRoleFilter');
            const statusFilter = document.getElementById('userStatusFilter');
            const role = roleFilter ? roleFilter.value : 'all';
            const status = statusFilter ? statusFilter.value : 'all';

            loadAllUsers(role, status);

            showToast('User deleted successfully', 'success');
        }
    }
}

// Edit room function
function editRoom(roomId) {
    const room = mockRooms.find(r => r.id === roomId);
    if (!room) {
        alert('Room not found');
        return;
    }

    // Populate edit room form
    document.getElementById('editRoomId').value = room.id;
    document.getElementById('editRoomNumber').value = room.roomNumber;
    document.getElementById('editRoomType').value = room.roomType;
    document.getElementById('editRoomPrice').value = room.price;
    document.getElementById('editMaxOccupancy').value = room.maxOccupancy;
    document.getElementById('editRoomDescription').value = room.description;
    document.getElementById('editRoomStatus').value = room.status;

    // Set amenities checkboxes
    document.querySelectorAll('input[name="editAmenities"]').forEach(checkbox => {
        checkbox.checked = room.amenities.includes(checkbox.value);
    });

    // Show current images (placeholder)
    const currentImages = document.getElementById('currentImages');
    if (currentImages) {
        if (room.images.length === 0) {
            currentImages.innerHTML = '<div class="placeholder-image">No images available</div>';
        } else {
            // In a real app, this would show actual images
            currentImages.innerHTML = '<div class="placeholder-image">Room image</div>';
        }
    }

    // Show modal
    showModal('editRoomModal');
}

// Delete room function
function deleteRoom(roomId) {
    if (confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
        const roomIndex = mockRooms.findIndex(r => r.id === roomId);
        if (roomIndex !== -1) {
            mockRooms.splice(roomIndex, 1);

            // Reload rooms list
            const typeFilter = document.getElementById('roomTypeFilter');
            const statusFilter = document.getElementById('roomStatusFilter');
            const type = typeFilter ? typeFilter.value : 'all';
            const status = statusFilter ? statusFilter.value : 'all';

            loadAllRooms(type, status);

            showToast('Room deleted successfully', 'success');
        }
    }
}

// Setup admin UI interactions
function setupAdminUIInteractions() {
    // Handle modal close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Image preview for room upload
    const roomImagesInput = document.getElementById('roomImages');
    const imagePreview = document.getElementById('imagePreview');

    if (roomImagesInput && imagePreview) {
        roomImagesInput.addEventListener('change', function() {
            imagePreview.innerHTML = '';

            if (this.files.length > 0) {
                for (let i = 0; i < this.files.length; i++) {
                    // In a real app, this would show actual image previews
                    const preview = document.createElement('div');
                    preview.className = 'image-preview-item';
                    preview.innerHTML = `
                        <div class="placeholder-image"></div>
                        <span>${this.files[i].name}</span>
                    `;
                    imagePreview.appendChild(preview);
                }
            }
        });
    }

    // Image preview for room edit upload
    const editRoomImagesInput = document.getElementById('editRoomImages');
    const editImagePreview = document.getElementById('editImagePreview');

    if (editRoomImagesInput && editImagePreview) {
        editRoomImagesInput.addEventListener('change', function() {
            editImagePreview.innerHTML = '';

            if (this.files.length > 0) {
                for (let i = 0; i < this.files.length; i++) {
                    // In a real app, this would show actual image previews
                    const preview = document.createElement('div');
                    preview.className = 'image-preview-item';
                    preview.innerHTML = `
                        <div class="placeholder-image"></div>
                        <span>${this.files[i].name}</span>
                    `;
                    editImagePreview.appendChild(preview);
                }
            }
        });
    }
}

