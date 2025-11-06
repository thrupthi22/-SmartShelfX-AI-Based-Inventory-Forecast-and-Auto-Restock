// In dto/SalesResponse.java
package com.smartshelf.smartshelf.dto;

import com.smartshelf.smartshelf.model.Sales;
import java.time.Instant;

public class SalesResponse {
    private Long id;
    private Long productId;
    private String productName;
    private int quantitySold;
    private Instant saleDate;

    public SalesResponse(Sales sale) {
        this.id = sale.getId();
        this.productId = sale.getProduct().getId();
        this.productName = sale.getProduct().getProductName();
        this.quantitySold = sale.getQuantitySold();
        this.saleDate = sale.getSaleDate();
    }

    // --- Getters ---
    public Long getId() {
        return id;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public int getQuantitySold() {
        return quantitySold;
    }

    public Instant getSaleDate() {
        return saleDate;
    }

    // --- Setters ---
    public void setId(Long id) {
        this.id = id;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setQuantitySold(int quantitySold) {
        this.quantitySold = quantitySold;
    }

    public void setSaleDate(Instant saleDate) {
        this.saleDate = saleDate;
    }
}
