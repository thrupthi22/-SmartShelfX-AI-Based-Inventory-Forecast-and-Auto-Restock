package com.smartshelf.smartshelf.controller;

import com.smartshelf.smartshelf.model.Product;
import com.smartshelf.smartshelf.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    @Autowired
    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // --- CREATE (Unchanged) ---
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    // --- UPDATED READ (Get All) ---
    @GetMapping
    public List<Product> getAllProducts(
            // We accept these as optional URL parameters
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String supplier,
            @RequestParam(required = false) Integer maxStock
    ) {
        // We pass the (null or not-null) values to our new query
        return productRepository.findWithFilters(category, supplier, maxStock);
    }

    // --- READ (Get One by ID) (Unchanged) ---
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- UPDATE (Unchanged) ---
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setProductName(productDetails.getProductName());
                    product.setCategory(productDetails.getCategory());
                    product.setQuantity(productDetails.getQuantity());
                    product.setPrice(productDetails.getPrice());
                    product.setSupplier(productDetails.getSupplier());
                    Product updatedProduct = productRepository.save(product);
                    return ResponseEntity.ok(updatedProduct);
                }).orElse(ResponseEntity.notFound().build());
    }

    // --- DELETE (Unchanged) ---
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> {
                    productRepository.delete(product);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}