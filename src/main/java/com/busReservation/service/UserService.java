package com.busReservation.service;

import com.busReservation.entity.User;
import com.busReservation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    // Load user by email for Spring Security authentication
    @Override
    public UserDetailsImpl loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return new UserDetailsImpl(user);
    }

    // Find user by email (optional, useful for login logic)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    // Register user (assuming User object already prepared)
    public void register(User user) {
        userRepository.save(user);
    }
}
