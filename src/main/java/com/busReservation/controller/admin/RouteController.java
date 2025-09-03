package com.busReservation.controller.admin;

import com.busReservation.entity.Route;
import com.busReservation.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/routes")
@CrossOrigin(origins = "http://localhost:3000")
public class RouteController {

    @Autowired
    private RouteRepository routeRepository;

    @PostMapping
    public ResponseEntity<?> createRoute(@RequestBody Route route) {
        Route savedRoute = routeRepository.save(route);
        return ResponseEntity.ok(savedRoute);
    }

    @GetMapping
    public ResponseEntity<List<Route>> getAllRoutes() {
        List<Route> routes = routeRepository.findAll();
        return ResponseEntity.ok(routes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRouteById(@PathVariable Long id) {
        Optional<Route> route = routeRepository.findById(id);
        return route.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoute(@PathVariable Long id, @RequestBody Route routeDetails) {
        Optional<Route> routeOptional = routeRepository.findById(id);
        if (!routeOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Route route = routeOptional.get();
        route.setSource(routeDetails.getSource());
        route.setDestination(routeDetails.getDestination());
        route.setDistance(routeDetails.getDistance());
        route.setDuration(routeDetails.getDuration());
        route.setStops(routeDetails.getStops());
        route.setStatus(routeDetails.getStatus());
        Route updatedRoute = routeRepository.save(route);
        return ResponseEntity.ok(updatedRoute);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoute(@PathVariable Long id) {
        Optional<Route> routeOptional = routeRepository.findById(id);
        if (!routeOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        routeRepository.delete(routeOptional.get());
        return ResponseEntity.ok().build();
    }
}

