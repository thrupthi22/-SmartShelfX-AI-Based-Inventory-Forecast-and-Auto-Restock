package com.smartshelf.smartshelf.model; // Make sure package is correct

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String productName;
    private String category;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double price;
    private String supplier;

    // --- 1. NEW FIELD ---
    @Column(length = 512) // Set a reasonable length for a URL
    private String imageUrl;

    // --- 2. No-argument constructor ---
    public Product() {
    }

    // --- 3. Getters and Setters (for all existing fields) ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getSupplier() {
        return supplier;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }

    // --- 4. GETTER AND SETTER FOR NEW FIELD ---
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}