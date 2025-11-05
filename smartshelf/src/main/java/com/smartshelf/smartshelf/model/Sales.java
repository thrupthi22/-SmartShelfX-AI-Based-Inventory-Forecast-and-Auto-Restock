package com.smartshelf.smartshelf.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "sales")
public class Sales {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // We link this sale to a specific product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private int quantitySold;

    @Column(nullable = false, updatable = false)
    private Instant saleDate; // Use Instant for TIMESTAMP

    @PrePersist
    protected void onCreate() {
        saleDate = Instant.now(); // Set the date automatically
    }

    // --- Constructor, Getters, Setters ---

    public Sales() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantitySold() {
        return quantitySold;
    }

    public void setQuantitySold(int quantitySold) {
        this.quantitySold = quantitySold;
    }

    public Instant getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(Instant saleDate) {
        this.saleDate = saleDate;
    }
}
