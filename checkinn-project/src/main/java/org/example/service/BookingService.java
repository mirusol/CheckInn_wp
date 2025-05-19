package org.example.service;

import org.example.dto.BookingDTO;
import org.example.exception.ResourceNotFoundException;
import org.example.model.Booking;
import org.example.model.Room;
import org.example.model.User;
import org.example.repository.BookingRepository;
import org.example.repository.RoomRepository;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return bookingRepository.findByUserId(userId);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
    }

    @Transactional
    public Booking createBooking(BookingDTO bookingDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Room room = roomRepository.findById(bookingDTO.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", bookingDTO.getRoomId()));

        // Check if room is available for the requested dates
        if (!isRoomAvailable(room.getId(), bookingDTO.getCheckInDate(), bookingDTO.getCheckOutDate())) {
            throw new RuntimeException("Room is not available for the requested dates");
        }

        // Calculate total price
        long days = ChronoUnit.DAYS.between(bookingDTO.getCheckInDate(), bookingDTO.getCheckOutDate());
        if (days < 1) {
            throw new RuntimeException("Check-out date must be after check-in date");
        }

        BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(days));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckInDate(bookingDTO.getCheckInDate());
        booking.setCheckOutDate(bookingDTO.getCheckOutDate());
        booking.setTotalPrice(totalPrice);
        booking.setStatus("PENDING"); // Default status
        booking.setBookingDate(LocalDate.now());

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateBookingStatus(Long id, String status) {
        Booking booking = getBookingById(id);

        if (!status.equals("PENDING") && !status.equals("CONFIRMED") && !status.equals("CANCELLED")) {
            throw new RuntimeException("Invalid booking status: " + status);
        }

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateBooking(Long id, BookingDTO bookingDTO) {
        Booking booking = getBookingById(id);

        // Only allow updates if the booking is still PENDING
        if (!booking.getStatus().equals("PENDING")) {
            throw new RuntimeException("Cannot update a booking that is not in PENDING status");
        }

        Room room = roomRepository.findById(bookingDTO.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", bookingDTO.getRoomId()));

        // Check if room is available for the requested dates (excluding this booking)
        if (!isRoomAvailableExcludingBooking(room.getId(), bookingDTO.getCheckInDate(),
                bookingDTO.getCheckOutDate(), id)) {
            throw new RuntimeException("Room is not available for the requested dates");
        }

        // Calculate total price
        long days = ChronoUnit.DAYS.between(bookingDTO.getCheckInDate(), bookingDTO.getCheckOutDate());
        if (days < 1) {
            throw new RuntimeException("Check-out date must be after check-in date");
        }

        BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(days));

        booking.setRoom(room);
        booking.setCheckInDate(bookingDTO.getCheckInDate());
        booking.setCheckOutDate(bookingDTO.getCheckOutDate());
        booking.setTotalPrice(totalPrice);

        return bookingRepository.save(booking);
    }

    @Transactional
    public void cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }

    /**
     * Check if a room is available for a given date range
     */
    public boolean isRoomAvailable(Long roomId, LocalDate checkInDate, LocalDate checkOutDate) {
        List<Room> availableRooms = roomRepository.findAvailableRoomsForDateRange(checkInDate, checkOutDate);
        return availableRooms.stream().anyMatch(room -> room.getId().equals(roomId));
    }

    /**
     * Check if a room is available for a given date range, excluding a specific booking
     */
    public boolean isRoomAvailableExcludingBooking(Long roomId, LocalDate checkInDate,
                                                   LocalDate checkOutDate, Long bookingId) {
        List<Booking> conflictingBookings = bookingRepository.findByRoomIdAndStatusNot(roomId, "CANCELLED");

        // Filter out the booking we're trying to update
        conflictingBookings = conflictingBookings.stream()
                .filter(booking -> !booking.getId().equals(bookingId))
                .filter(booking ->
                        (booking.getCheckInDate().isBefore(checkOutDate) || booking.getCheckInDate().isEqual(checkOutDate)) &&
                                (booking.getCheckOutDate().isAfter(checkInDate) || booking.getCheckOutDate().isEqual(checkInDate)))
                .toList();

        return conflictingBookings.isEmpty();
    }
}
