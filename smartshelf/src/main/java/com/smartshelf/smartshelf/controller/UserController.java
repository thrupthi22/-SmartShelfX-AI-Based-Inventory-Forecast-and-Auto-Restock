package com.smartshelf.smartshelf.controller;

import com.smartshelf.smartshelf.model.Role;
import com.smartshelf.smartshelf.model.User;
import com.smartshelf.smartshelf.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Get all users (for Admin dashboard)
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Promote a user to STORE_MANAGER
    @PutMapping("/{id}/promote")
    public ResponseEntity<?> promoteToManager(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            user.setRole(Role.STORE_MANAGER);
            userRepository.save(user);
            return ResponseEntity.ok("User promoted to STORE_MANAGER successfully.");
        }).orElse(ResponseEntity.notFound().build());
    }

    // Demote a manager back to USER (just in case)
    @PutMapping("/{id}/demote")
    public ResponseEntity<?> demoteToUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            user.setRole(Role.USER);
            userRepository.save(user);
            return ResponseEntity.ok("User demoted to USER successfully.");
        }).orElse(ResponseEntity.notFound().build());
    }
}