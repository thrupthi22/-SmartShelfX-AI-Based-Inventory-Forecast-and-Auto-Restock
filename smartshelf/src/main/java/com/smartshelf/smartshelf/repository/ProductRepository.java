package com.smartshelf.smartshelf.repository;

import com.smartshelf.smartshelf.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <-- 1. NEW IMPORT
import org.springframework.data.repository.query.Param; // <-- 2. NEW IMPORT

import java.util.List; // <-- 3. NEW IMPORT

public interface ProductRepository extends JpaRepository<Product, Long> {

    // --- 4. NEW CUSTOM QUERY ---
    /**
     * Finds products using optional filters.
     * If a filter is null, it's ignored.
     * We use "p.quantity <= :maxStock" to find items *at or below* a stock level.
     */
    @Query("SELECT p FROM Product p WHERE " +
            "(:category IS NULL OR p.category = :category) AND " +
            "(:supplier IS NULL OR p.supplier = :supplier) AND " +
            "(:maxStock IS NULL OR p.quantity <= :maxStock)")
    List<Product> findWithFilters(
            @Param("category") String category,
            @Param("supplier") String supplier,
            @Param("maxStock") Integer maxStock
    );
}