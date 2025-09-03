package com.busReservation.config;

import com.busReservation.security.JwtAuthenticationFilter;
import com.busReservation.security.JwtUtil;
import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
            	    .requestMatchers("/api/v1/auth/**", "/api/v1/register").permitAll()
            	    .requestMatchers("/api/v1/buses/**").permitAll()
            	    .requestMatchers("/api/v1/customers/**").permitAll()
            	    .requestMatchers("/api/v1/routes/**", "/api/v1/trips/**").permitAll()
            	    .requestMatchers(HttpMethod.POST, "/api/v1/customers").hasRole("CUSTOMER")
            	    .requestMatchers("/api/v1/customers/**").hasRole("CUSTOMER")
            	    .requestMatchers(HttpMethod.POST, "/api/v1/bookings").hasAnyRole("CUSTOMER", "ADMIN")
            	    .requestMatchers("/api/v1/bookings/**").hasAnyRole("CUSTOMER", "ADMIN")
            	    .requestMatchers("/api/v1/buses/**", "/api/v1/trips/**").hasAnyRole("ADMIN", "CUSTOMER")
            	    .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
            	    .requestMatchers("/api/v1/trips/search/**").permitAll()	    
            	    .anyRequest().authenticated()
            	);

        http.addFilterBefore(new JwtAuthenticationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
