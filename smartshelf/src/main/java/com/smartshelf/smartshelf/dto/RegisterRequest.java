package com.smartshelf.smartshelf.dto;

public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;
    private String contact;
    private String location;
    private String role; // <-- 1. NEW FIELD

    // --- Getters and Setters ---

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    // --- 2. NEW GETTER AND SETTER ---
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}