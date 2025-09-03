package com.busReservation.controller.user;

import com.busReservation.entity.Customer;
import com.busReservation.entity.User;
import com.busReservation.repository.CustomerRepository;
import com.busReservation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/customers")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all customers
    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Get customer by ID
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        return customerOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create new customer with authenticated user association
    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {
        User currentUser = getCurrentUser();
        if (currentUser != null) {
            customer.setUser(currentUser);
        } else {
            // For public registration, no associated user yet
            customer.setUser(null);
        }
        Customer saved = customerRepository.save(customer);
        return ResponseEntity.ok(saved);
    }

    // Update customer details
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customerDetails) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (!customerOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Customer customer = customerOpt.get();
        customer.setFullName(customerDetails.getFullName());
        customer.setPhone(customerDetails.getPhone());
        customer.setAddress(customerDetails.getAddress());
        customer.setDocId(customerDetails.getDocId());
        // Typically do not update user reference here; keep as is or add security check
        Customer updated = customerRepository.save(customer);
        return ResponseEntity.ok(updated);
    }

    // Delete customer
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (!customerOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        customerRepository.delete(customerOpt.get());
        return ResponseEntity.ok().build();
    }

    // Helper method to get the currently authenticated User entity
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return null;
        }
        String username = auth.getName();
        return userRepository.findByUsername(username).orElse(null);
    }
}
