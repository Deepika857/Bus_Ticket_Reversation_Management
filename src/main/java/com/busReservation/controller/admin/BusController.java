package com.busReservation.controller.admin;

import com.busReservation.entity.Bus;
import com.busReservation.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/buses")
@CrossOrigin(origins = "http://localhost:3000")
public class BusController {
    @Autowired
    private BusRepository busRepository;

    @PostMapping
    public ResponseEntity<?> createBus(@RequestBody Bus bus) {
        if (busRepository.existsByBusNumber(bus.getBusNumber())) {
            return ResponseEntity.badRequest().body("Bus number already exists");
        }
        Bus savedBus = busRepository.save(bus);
        return ResponseEntity.ok(savedBus);
    }

    @GetMapping
    public ResponseEntity<List<Bus>> getAllBuses() {
        List<Bus> buses = busRepository.findAll();
        return ResponseEntity.ok(buses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBusById(@PathVariable Long id) {
        Optional<Bus> bus = busRepository.findById(id);
        return bus.map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBus(@PathVariable Long id, @RequestBody Bus busDetails) {
        Optional<Bus> busOptional = busRepository.findById(id);
        if (!busOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Bus bus = busOptional.get();

        if (!bus.getBusNumber().equals(busDetails.getBusNumber()) &&
            busRepository.existsByBusNumber(busDetails.getBusNumber())) {
            return ResponseEntity.badRequest().body("Bus number already exists");
        }

        bus.setBusNumber(busDetails.getBusNumber());
        bus.setBusType(busDetails.getBusType());
        bus.setOperatorName(busDetails.getOperatorName());
        bus.setTotalSeats(busDetails.getTotalSeats());
        bus.setCapacity(busDetails.getCapacity());
        bus.setCols(busDetails.getCols());
        bus.setSeatLayout(busDetails.getSeatLayout());
        bus.setStatus(busDetails.getStatus());

        Bus updatedBus = busRepository.save(bus);
        return ResponseEntity.ok(updatedBus);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBus(@PathVariable Long id) {
        Optional<Bus> busOptional = busRepository.findById(id);
        if (!busOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Add trip check logic if required here

        busRepository.delete(busOptional.get());
        return ResponseEntity.ok().build();
    }
}

