package com.smartshelf.smartshelf.repository;

import com.smartshelf.smartshelf.model.Sales;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesRepository extends JpaRepository<Sales, Long> {
    // You can add custom report queries here later,
    // e.g., List<Sales> findBySaleDateBetween(Instant start, Instant end);
}