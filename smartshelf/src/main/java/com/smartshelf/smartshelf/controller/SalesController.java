package com.smartshelf.smartshelf.controller;

import com.smartshelf.smartshelf.dto.SalesRequest;
import com.smartshelf.smartshelf.model.Product;
import com.smartshelf.smartshelf.model.Sales;
import com.smartshelf.smartshelf.repository.ProductRepository;
import com.smartshelf.smartshelf.repository.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping("/report")
    public List<Sales> getSalesReport() {
        // Returns all sales. Later, you can add date filtering.
        return salesRepository.findAll();
    }
}
