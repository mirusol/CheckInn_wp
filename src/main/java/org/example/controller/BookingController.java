package org.example.controller;

import org.example.dto.BookingDTO;
import org.example.model.Booking;
import org.example.model.Room;
import org.example.model.User;
import org.example.service.BookingService;
import org.example.service.RoomService;
import org.example.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.List;

@Controller
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private UserService userService;

    @GetMapping("/rooms/{roomId}/book")
    public String showBookingForm(@PathVariable Long roomId,
                                  @RequestParam(required = false) LocalDate checkIn,
                                  @RequestParam(required = false) LocalDate checkOut,
                                  Model model) {
        Room room = roomService.getRoomById(roomId);
        model.addAttribute("room", room);

        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setRoomId(roomId);

        if (checkIn != null) {
            bookingDTO.setCheckInDate(checkIn);
        }

        if (checkOut != null) {
            bookingDTO.setCheckOutDate(checkOut);
        }

        model.addAttribute("bookingDTO", bookingDTO);

        return "booking/book";
    }

    @PostMapping("/rooms/{roomId}/book")
    public String createBooking(@PathVariable Long roomId,
                                @Valid @ModelAttribute("bookingDTO") BookingDTO bookingDTO,
                                BindingResult bindingResult,
                                RedirectAttributes redirectAttributes,
                                Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("room", roomService.getRoomById(roomId));
            return "booking/book";
        }

        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userService.getUserByEmail(auth.getName());

            Booking booking = bookingService.createBooking(bookingDTO, user.getId());

            redirectAttributes.addFlashAttribute("successMessage", "Booking created successfully!");
            return "redirect:/booking/confirmation/" + booking.getId();
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/rooms/" + roomId + "/book";
        }
    }

    @GetMapping("/booking/confirmation/{id}")
    public String showBookingConfirmation(@PathVariable Long id, Model model) {
        Booking booking = bookingService.getBookingById(id);
        model.addAttribute("booking", booking);
        return "booking/confirmation";
    }

    @GetMapping("/user/bookings")
    public String listUserBookings(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByEmail(auth.getName());

        List<Booking> bookings = bookingService.getBookingsByUserId(user.getId());
        model.addAttribute("bookings", bookings);

        return "user/bookings";
    }

    @PostMapping("/user/bookings/{id}/cancel")
    public String cancelBooking(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByEmail(auth.getName());

        Booking booking = bookingService.getBookingById(id);

        // Verify that the booking belongs to the current user
        if (!booking.getUser().getId().equals(user.getId())) {
            redirectAttributes.addFlashAttribute("errorMessage", "You do not have permission to cancel this booking");
            return "redirect:/user/bookings";
        }

        bookingService.cancelBooking(id);
        redirectAttributes.addFlashAttribute("successMessage", "Booking cancelled successfully");

        return "redirect:/user/bookings";
    }

    @GetMapping("/admin/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminBookings(Model model) {
        List<Booking> bookings = bookingService.getAllBookings();
        model.addAttribute("bookings", bookings);
        return "admin/bookings";
    }

    @PostMapping("/admin/bookings/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public String updateBookingStatus(@PathVariable Long id,
                                      @RequestParam String status,
                                      RedirectAttributes redirectAttributes) {
        try {
            bookingService.updateBookingStatus(id, status);
            redirectAttributes.addFlashAttribute("successMessage", "Booking status updated successfully");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }

        return "redirect:/admin/bookings";
    }

    // REST API endpoints for booking operations

    @GetMapping("/api/bookings")
    @ResponseBody
    public List<Booking> getUserBookings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByEmail(auth.getName());

        return bookingService.getBookingsByUserId(user.getId());
    }

    @GetMapping("/api/bookings/{id}")
    @ResponseBody
    public Booking getBookingById(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByEmail(auth.getName());

        Booking booking = bookingService.getBookingById(id);

        // Verify that the booking belongs to the current user or user is admin
        if (!booking.getUser().getId().equals(user.getId()) && !user.getRole().equals("ROLE_ADMIN")) {
            throw new RuntimeException("You do not have permission to view this booking");
        }

        return booking;
    }

    @PostMapping("/api/bookings")
    @ResponseBody
    public Booking createBookingApi(@Valid @RequestBody BookingDTO bookingDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByEmail(auth.getName());

        return bookingService.createBooking(bookingDTO, user.getId());
    }

    @PutMapping("/api/bookings/{id}/cancel")
    @ResponseBody
    public Booking cancelBookingApi(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByEmail(auth.getName());

        Booking booking = bookingService.getBookingById(id);

        // Verify that the booking belongs to the current user
        if (!booking.getUser().getId().equals(user.getId()) && !user.getRole().equals("ROLE_ADMIN")) {
            throw new RuntimeException("You do not have permission to cancel this booking");
        }

        bookingService.cancelBooking(id);
        return bookingService.getBookingById(id);
    }

    @GetMapping("/api/admin/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseBody
    public List<Booking> getAllBookingsApi() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/api/admin/bookings/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseBody
    public Booking updateBookingStatusApi(
            @PathVariable Long id,
            @RequestParam String status) {
        return bookingService.updateBookingStatus(id, status);
    }
}