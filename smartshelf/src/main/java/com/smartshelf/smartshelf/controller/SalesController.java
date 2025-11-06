package com.smartshelf.smartshelf.controller;

import com.smartshelf.smartshelf.dto.SalesRequest;
import com.smartshelf.smartshelf.dto.SalesResponse; // <-- NEW IMPORT
import com.smartshelf.smartshelf.model.Product;
import com.smartshelf.smartshelf.model.Sales;
import com.smartshelf.smartshelf.repository.ProductRepository;
import com.smartshelf.smartshelf.repository.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat; // <-- NEW IMPORT
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant; // <-- NEW IMPORT
import java.util.List;
// We need this import for .stream() and .toList()
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

        Sales savedSale = salesRepository.save(newSale);
        return ResponseEntity.ok(savedSale);
    }

    /**
     * Retrieves all sales records for reporting.
     */
    // --- UPDATED getSalesReport method ---
    @GetMapping("/report")
    public List<SalesResponse> getSalesReport(
            // We accept dates in ISO format (e.g., 2025-11-01T00:00:00Z)
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate
    ) {
        if (startDate != null && endDate != null) {
            // If both dates are provided, use the new filter
            return salesRepository.findBySaleDateBetween(startDate, endDate).stream()
                    .map(SalesResponse::new) // Convert each Sale to a SalesResponse
                    .collect(Collectors.toList()); // Use .collect(Collectors.toList()) for compatibility
        } else {
            // Otherwise, just return all sales
            return salesRepository.findAll().stream()
                    .map(SalesResponse::new) // Convert each Sale to a SalesResponse
                    .collect(Collectors.toList());
        }
    }
}