// In repository/SalesRepository.java
package com.smartshelf.smartshelf.repository;

import com.smartshelf.smartshelf.model.Sales;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant; // <-- NEW IMPORT
import java.util.List;    // <-- NEW IMPORT

public interface SalesRepository extends JpaRepository<Sales, Long> {

    // --- NEW METHOD ---
    /**
     * Finds all sales records that fall between a start and end date.
     * Spring Data JPA will automatically build this query for us.
     */
    List<Sales> findBySaleDateBetween(Instant startDate, Instant endDate);
}