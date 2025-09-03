package com.busReservation.controller;

import com.busReservation.entity.Booking;
import com.busReservation.entity.Trip;
import com.busReservation.service.BookingService;
import com.busReservation.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private TripRepository tripRepository;

    // Get all bookings - ADMIN only
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // Create a new booking - CUSTOMER and ADMIN roles
    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        // Validate trip presence
        if (booking.getTrip() == null || booking.getTrip().getTripId() == null) {
            return ResponseEntity.badRequest().body("Trip is required");
        }

        Long tripId = booking.getTrip().getTripId();

        // Check if trip exists in DB
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        // Validate customer name
        if (booking.getCustomerName() == null || booking.getCustomerName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Customer name is required");
        }

        // Validate seats selected
        if (booking.getSeats() == null || booking.getSeats().isEmpty()) {
            return ResponseEntity.badRequest().body("At least one seat must be selected");
        }

        // Validate total amount
        if (booking.getTotalAmount() == null || booking.getTotalAmount() <= 0) {
            return ResponseEntity.badRequest().body("Total amount must be positive");
        }

        // Validate payment type
     // Validate payment type
        String paymentType = booking.getPaymentType();
        if (paymentType == null || paymentType.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Payment type is required");
        }

        // Set trip reference and booking date
        booking.setTrip(trip);
        booking.setBookingDate(LocalDateTime.now());

        // Set default booking status if not provided
        if (booking.getStatus() == null || booking.getStatus().trim().isEmpty()) {
            booking.setStatus("Confirmed");
        }

        // Save booking
        Booking savedBooking = bookingService.saveBooking(booking);
        return ResponseEntity.ok(savedBooking);
    }

    // Update booking status - ADMIN only
    @PutMapping("/{bookingId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long bookingId,
                                                @RequestBody String newStatus) {
        Booking booking = bookingService.getBookingById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("New status is required");
        }

        booking.setStatus(newStatus);
        Booking updatedBooking = bookingService.saveBooking(booking);
        return ResponseEntity.ok(updatedBooking);
    }
}
