package com.smartshelf.smartshelf.repository;

import com.smartshelf.smartshelf.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    // Custom query method to check if a supplier name already exists
    boolean existsByName(String name);
}