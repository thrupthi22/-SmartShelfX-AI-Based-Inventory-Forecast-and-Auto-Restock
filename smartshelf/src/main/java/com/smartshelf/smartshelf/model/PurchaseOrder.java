package com.smartshelf.smartshelf.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private int quantityToOrder;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    // --- ENUM for Status ---
    public enum Status {
        PENDING,   // AI suggested it, waiting for manager approval
        APPROVED,  // Manager clicked "Order"
        ORDERED,   // Sent to supplier
        RECEIVED   // Added to inventory
    }

    // --- Getters and Setters ---
    public PurchaseOrder() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public int getQuantityToOrder() { return quantityToOrder; }
    public void setQuantityToOrder(int quantityToOrder) { this.quantityToOrder = quantityToOrder; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
