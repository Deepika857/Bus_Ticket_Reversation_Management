package com.busReservation.repository;

import com.busReservation.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b.trip.departureTime AS date, COUNT(b) AS bookings " +
           "FROM Booking b " +
           "WHERE b.trip.departureTime BETWEEN :startDate AND :endDate " +
           "GROUP BY b.trip.departureTime " +
           "ORDER BY b.trip.departureTime")
    List<Object[]> countBookingsByDay(@Param("startDate") LocalDateTime startDate, 
                                      @Param("endDate") LocalDateTime endDate);
    @Query("SELECT b FROM Booking b WHERE b.customerName = :username")
    List<Booking> findByCustomerUsername(@Param("username") String username);
}

