package com.busReservation.repository;

import com.busReservation.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {

    boolean existsByBusNumber(String busNumber);
    List<Bus> findByBusType(String busType);
    List<Bus> findByOperatorNameIgnoreCase(String operatorName);
    List<Bus> findByStatus(String status);
    List<Bus> findByBusNumberContainingAndBusTypeContainingAndOperatorNameContainingAllIgnoreCase(
        String busNumber, String busType, String operatorName);
}
