package com.busReservation.repository;

import com.busReservation.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    @Query("SELECT t FROM Trip t WHERE t.route.source = :source AND t.route.destination = :destination " +
           "AND t.departureTime BETWEEN :startOfDay AND :endOfDay")
    List<Trip> searchTripsByRouteAndDate(
            @Param("source") String source,
            @Param("destination") String destination,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay);
}
