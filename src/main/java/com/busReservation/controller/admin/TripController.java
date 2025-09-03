package com.busReservation.controller.admin;

import com.busReservation.entity.Bus;
import com.busReservation.entity.Route;
import com.busReservation.entity.Trip;
import com.busReservation.repository.BusRepository;
import com.busReservation.repository.RouteRepository;
import com.busReservation.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/trips")
@CrossOrigin(origins = "http://localhost:3000")
public class TripController {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private RouteRepository routeRepository;

    @PostMapping
    public ResponseEntity<?> createTrip(@RequestBody TripDTO tripDTO) {
        Optional<Bus> busOpt = busRepository.findById(tripDTO.getBusId());
        Optional<Route> routeOpt = routeRepository.findById(tripDTO.getRouteId());
        if (!busOpt.isPresent() || !routeOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Invalid Bus or Route ID");
        }

        Trip trip = new Trip();
        trip.setBus(busOpt.get());
        trip.setRoute(routeOpt.get());
        trip.setDepartureTime(tripDTO.getDepartureTime());
        trip.setArrivalTime(tripDTO.getArrivalTime());
        trip.setFare(tripDTO.getFare());
        trip.setStatus(tripDTO.getStatus());

        Trip savedTrip = tripRepository.save(trip);
        return ResponseEntity.ok(savedTrip);
    }

    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips() {
        return ResponseEntity.ok(tripRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(@PathVariable Long id) {
        Optional<Trip> trip = tripRepository.findById(id);
        return trip.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrip(@PathVariable Long id, @RequestBody TripDTO tripDTO) {
        Optional<Trip> tripOpt = tripRepository.findById(id);
        if (!tripOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Optional<Bus> busOpt = busRepository.findById(tripDTO.getBusId());
        Optional<Route> routeOpt = routeRepository.findById(tripDTO.getRouteId());
        if (!busOpt.isPresent() || !routeOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Invalid Bus or Route ID");
        }

        Trip trip = tripOpt.get();
        trip.setBus(busOpt.get());
        trip.setRoute(routeOpt.get());
        trip.setDepartureTime(tripDTO.getDepartureTime());
        trip.setArrivalTime(tripDTO.getArrivalTime());
        trip.setFare(tripDTO.getFare());
        trip.setStatus(tripDTO.getStatus());

        Trip updatedTrip = tripRepository.save(trip);
        return ResponseEntity.ok(updatedTrip);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        Optional<Trip> tripOpt = tripRepository.findById(id);
        if (!tripOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        tripRepository.delete(tripOpt.get());
        return ResponseEntity.ok().build();
    }

    // DTO class in controller or as a separate file
    public static class TripDTO {
        private Long busId;
        private Long routeId;
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        private LocalDateTime departureTime;
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        private LocalDateTime arrivalTime;
        private Double fare;
        private String status;

        // Getters and setters
        public Long getBusId() { return busId; }
        public void setBusId(Long busId) { this.busId = busId; }
        public Long getRouteId() { return routeId; }
        public void setRouteId(Long routeId) { this.routeId = routeId; }
        public LocalDateTime getDepartureTime() { return departureTime; }
        public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; }
        public LocalDateTime getArrivalTime() { return arrivalTime; }
        public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }
        public Double getFare() { return fare; }
        public void setFare(Double fare) { this.fare = fare; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
