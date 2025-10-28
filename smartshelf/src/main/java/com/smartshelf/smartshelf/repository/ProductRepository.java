package com.smartshelf.smartshelf.repository;



import com.smartshelf.smartshelf.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

// We extend JpaRepository, telling it to manage
// the 'Product' model, whose ID is a 'Long'
public interface ProductRepository extends JpaRepository<Product, Long> {
    // That's it! Spring Data JPA builds all the methods.
}