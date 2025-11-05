package com.smartshelf.smartshelf.dto; // Make sure package name is correct

public class LoginResponse {
    private String email;
    private String token;
    private String role; // <-- NEW FIELD

    // Constructor updated to include role
    public LoginResponse(String email, String token, String role) {
        this.email = email;
        this.token = token;
        this.role = role; // <-- NEW
    }

    // --- Getters and Setters ---

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    // --- NEW GETTER AND SETTER FOR ROLE ---
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}