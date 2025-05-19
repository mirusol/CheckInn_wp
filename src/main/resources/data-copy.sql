-- Clear existing data (optional)
DELETE FROM room_images;
DELETE FROM bookings;
DELETE FROM rooms;
DELETE FROM users;


-- Create rooms
INSERT INTO rooms (name, type, description, price_per_night, capacity, available)
VALUES
    ('Deluxe Ocean View', 'Deluxe', 'Spacious room with stunning ocean views and a private balcony.', 199.99, 2, true),
    ('Family Suite', 'Suite', 'Large suite with separate living area and two bedrooms perfect for families.', 299.99, 4, true),
    ('Standard Room', 'Standard', 'Comfortable room with all essential amenities for a pleasant stay.', 99.99, 2, true),
    ('Executive Suite', 'Suite', 'Luxury suite with office space and premium amenities for business travelers.', 349.99, 2, true),
    ('Honeymoon Suite', 'Suite', 'Romantic suite with private jacuzzi and champagne service.', 399.99, 2, true);


-- Add sample bookings
INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, total_price, status, booking_date)
VALUES
    (2, 1, '2025-06-01', '2025-06-05', 799.96, 'CONFIRMED', '2025-05-15'),
    (2, 3, '2025-07-10', '2025-07-15', 499.95, 'PENDING', '2025-05-18'),
    (3, 5, '2025-06-15', '2025-06-17', 799.98, 'CONFIRMED', '2025-05-10');