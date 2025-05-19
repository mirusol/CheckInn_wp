
-- Add sample bookings
INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, total_price, status, booking_date)
VALUES
    (7, 7, '2025-06-01', '2025-06-05', 799.96, 'CONFIRMED', '2025-05-15'),
    (8, 8, '2025-07-10', '2025-07-15', 499.95, 'PENDING', '2025-05-18'),
    (9, 9, '2025-06-15', '2025-06-17', 799.98, 'CONFIRMED', '2025-05-10');