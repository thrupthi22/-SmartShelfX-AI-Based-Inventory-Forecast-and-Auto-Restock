package com.smartshelf.smartshelf.dto;

// This DTO exists solely to receive the JSON payload from the frontend.

public class PurchaseOrderRequest {
    public Long productId;
    public int quantity;

    // Optional: Add getters/setters or a constructor if required by your Spring version,
    // but default public fields are often sufficient for DTOs.
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}