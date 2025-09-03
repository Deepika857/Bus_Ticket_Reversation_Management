package com.busReservation.service.admin;

import com.busReservation.entity.Trip;
import com.busReservation.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    // Create or update a trip
    public Trip saveTrip(Trip trip) {
        return tripRepository.save(trip);
    }

    // Get all trips
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    // Find trip by ID
    public Optional<Trip> getTripById(Long id) {
        return tripRepository.findById(id);
    }

    // Delete trip by ID
    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }
}
