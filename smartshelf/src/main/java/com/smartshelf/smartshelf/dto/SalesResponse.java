package com.smartshelf.smartshelf.dto;

import com.smartshelf.smartshelf.model.Sales;
import com.smartshelf.smartshelf.model.Product;

import java.time.Instant;

public class SalesResponse {
    private Long id;
    private Long productId;
    private String productName;
    private int quantitySold;
    private double price; // <<< FIX: ADDED PRICE FIELD
    private Instant saleDate;

    public SalesResponse() {}

    // Constructor to map Sales entity to Response DTO
    public SalesResponse(Sales sale) {
        Product product = sale.getProduct();

        this.id = sale.getId();
        this.quantitySold = sale.getQuantitySold();
        this.saleDate = sale.getSaleDate();

        if (product != null) {
            this.productId = product.getId();
            this.productName = product.getProductName();
            this.price = product.getPrice(); // <<< FIX: Populating price from Product
        } else {
            this.productId = null;
            this.productName = "N/A";
            this.price = 0.0;
        }
    }

    // --- Getters (Required by Spring/Jackson for serialization) ---
    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public int getQuantitySold() { return quantitySold; }
    public double getPrice() { return price; } // <<< FIX: PRICE GETTER
    public Instant getSaleDate() { return saleDate; }

    // --- Setters (Unused but kept for completeness) ---
    public void setId(Long id) { this.id = id; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setQuantitySold(int quantitySold) { this.quantitySold = quantitySold; }
    public void setPrice(double price) { this.price = price; }
    public void setSaleDate(Instant saleDate) { this.saleDate = saleDate; }
}