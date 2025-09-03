package com.busReservation.service.admin;

import com.busReservation.entity.Bus;
import com.busReservation.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    // Create new bus with unique busNumber validation
    public Bus createBus(Bus bus) throws IllegalArgumentException {
        if (busRepository.existsByBusNumber(bus.getBusNumber())) {
            throw new IllegalArgumentException("Bus number already exists");
        }
        return busRepository.save(bus);
    }

    // Get all buses
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    // Get bus by id
    public Optional<Bus> getBusById(Long id) {
        return busRepository.findById(id);
    }

    // Update existing bus
    public Bus updateBus(Long id, Bus busDetails) throws IllegalArgumentException, IllegalStateException {
        Optional<Bus> busOptional = busRepository.findById(id);
        if (!busOptional.isPresent()) {
            throw new IllegalStateException("Bus not found");
        }
        Bus bus = busOptional.get();

        if (!bus.getBusNumber().equals(busDetails.getBusNumber()) &&
            busRepository.existsByBusNumber(busDetails.getBusNumber())) {
            throw new IllegalArgumentException("Bus number already exists");
        }

        bus.setBusNumber(busDetails.getBusNumber());
        bus.setBusType(busDetails.getBusType());
        bus.setOperatorName(busDetails.getOperatorName());
        bus.setTotalSeats(busDetails.getTotalSeats());
        bus.setCapacity(busDetails.getCapacity());
        bus.setCols(busDetails.getCols());
        bus.setSeatLayout(busDetails.getSeatLayout());
        bus.setStatus(busDetails.getStatus());

        return busRepository.save(bus);
    }

    // Delete bus by id
    public void deleteBus(Long id) throws IllegalStateException {
        Optional<Bus> busOptional = busRepository.findById(id);
        if (!busOptional.isPresent()) {
            throw new IllegalStateException("Bus not found");
        }

        // Add checks for scheduled trips if needed (not implemented here)

        busRepository.delete(busOptional.get());
    }
}
