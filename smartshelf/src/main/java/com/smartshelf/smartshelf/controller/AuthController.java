package com.smartshelf.smartshelf.controller;

import com.smartshelf.smartshelf.dto.LoginRequest;
import com.smartshelf.smartshelf.dto.LoginResponse;
import com.smartshelf.smartshelf.dto.RegisterRequest;
import com.smartshelf.smartshelf.model.Role;
import com.smartshelf.smartshelf.model.User;
import com.smartshelf.smartshelf.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.util.Date;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SecretKey jwtSecretKey;
    private final long jwtExpirationMs = 86400000;

    @Autowired
    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          SecretKey jwtSecretKey) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtSecretKey = jwtSecretKey;
    }

    // --- UPDATED REGISTRATION ENDPOINT ---
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {

        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setFullName(registerRequest.getFullName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setContact(registerRequest.getContact());
        user.setLocation(registerRequest.getLocation());

        // --- THIS IS THE UPDATED LOGIC ---
        // It reads the role from the request for the demo.
        try {
            // Convert the string ("ADMIN") to the enum (Role.ADMIN)
            Role roleToSet = Role.valueOf(registerRequest.getRole().toUpperCase());
            user.setRole(roleToSet);
        } catch (IllegalArgumentException | NullPointerException e) {
            // If the role is invalid or null, default to USER for safety
            user.setRole(Role.USER);
        }
        // --- END OF UPDATED LOGIC ---

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    // --- LOGIN ENDPOINT (Unchanged) ---
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            String token = Jwts.builder()
                    .setSubject(user.getEmail())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                    .signWith(jwtSecretKey, SignatureAlgorithm.HS512)
                    .compact();

            return ResponseEntity.ok(new LoginResponse(user.getEmail(), token, user.getRole().name()));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}