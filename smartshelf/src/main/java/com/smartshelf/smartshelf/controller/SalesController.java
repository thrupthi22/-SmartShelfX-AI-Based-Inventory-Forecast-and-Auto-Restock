package com.smartshelf.smartshelf.controller;

import com.smartshelf.smartshelf.dto.SalesRequest;
import com.smartshelf.smartshelf.dto.SalesResponse;
import com.smartshelf.smartshelf.model.Product;
import com.smartshelf.smartshelf.model.Sales;
import com.smartshelf.smartshelf.repository.ProductRepository;
import com.smartshelf.smartshelf.repository.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate; // <<< ADDED
import java.time.ZoneId; // <<< ADDED
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sales")
public class SalesController {

    private final SalesRepository salesRepository;
    private final ProductRepository productRepository;

    @Autowired
    public SalesController(SalesRepository salesRepository, ProductRepository productRepository) {
        this.salesRepository = salesRepository;
        this.productRepository = productRepository;
    }

    /**
     * Records a new sale and updates the product's inventory.
     */
    @PostMapping
    public ResponseEntity<?> recordSale(@RequestBody SalesRequest salesRequest) {

        // 1. Find the product
        Product product = productRepository.findById(salesRequest.getProductId())
                .orElse(null);

        if (product == null) {
            return ResponseEntity.badRequest().body("Error: Product not found!");
        }

        // 2. Check if there is enough stock
        if (product.getQuantity() < salesRequest.getQuantitySold()) {
            return ResponseEntity.badRequest().body("Error: Not enough stock!");
        }

        // 3. Update the product's quantity
        int newQuantity = product.getQuantity() - salesRequest.getQuantitySold();
        product.setQuantity(newQuantity);
        productRepository.save(product); // Save the updated product

        // 4. Create and save the new sales record
        Sales newSale = new Sales();
        newSale.setProduct(product);
        newSale.setQuantitySold(salesRequest.getQuantitySold());
        newSale.setSaleDate(Instant.now()); // Ensure sale date is recorded

        Sales savedSale = salesRepository.save(newSale);
        return ResponseEntity.ok(savedSale);
    }

    /**
     * Retrieves sales records for reporting within a date range.
     */
    // --- UPDATED getSalesReport method (FIXED DATE TYPES) ---
    @GetMapping("/report")
    public List<SalesResponse> getSalesReport(
            // FIX: Accept as LocalDate (YYYY-MM-DD string) to match frontend output
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        // If dates are provided, convert them to Instant range for the repository
        if (startDate != null && endDate != null) {
            // Start of day for the start date
            Instant startInstant = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
            // End of day for the end date (1 nanosecond before the next day starts)
            Instant endInstant = endDate.atStartOfDay(ZoneId.systemDefault()).plusDays(1).minusNanos(1).toInstant();

            return salesRepository.findBySaleDateBetween(startInstant, endInstant).stream()
                    .map(SalesResponse::new)
                    .collect(Collectors.toList());
        } else {
            // If no dates are provided (initial load), return all sales
            return salesRepository.findAll().stream()
                    .map(SalesResponse::new)
                    .collect(Collectors.toList());
        }
    }
}