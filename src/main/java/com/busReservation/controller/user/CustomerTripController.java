package com.busReservation.controller.user;

import com.busReservation.entity.Trip;
import com.busReservation.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/trips")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerTripController {

    @Autowired
    private TripRepository tripRepository;

    @GetMapping("/search")
    public List<Trip> searchTrips(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay().minusNanos(1);

        return tripRepository.searchTripsByRouteAndDate(from, to, startOfDay, endOfDay);
    }
}
