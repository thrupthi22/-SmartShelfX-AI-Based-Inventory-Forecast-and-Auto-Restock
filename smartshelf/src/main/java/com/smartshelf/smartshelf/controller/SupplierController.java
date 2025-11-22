package com.smartshelf.smartshelf.controller;

import com.smartshelf.smartshelf.model.Supplier;
import com.smartshelf.smartshelf.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    @Autowired
    private SupplierRepository supplierRepository;

    // READ: Get all suppliers
    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    // CREATE: Add new supplier
    @PostMapping
    public ResponseEntity<?> createSupplier(@RequestBody Supplier supplier) {
        if (supplierRepository.existsByName(supplier.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Supplier name already exists.");
        }
        Supplier savedSupplier = supplierRepository.save(supplier);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSupplier);
    }

    // UPDATE: Modify existing supplier
    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier updatedSupplier) {
        return supplierRepository.findById(id)
                .map(supplier -> {
                    supplier.setName(updatedSupplier.getName());
                    supplier.setContactPerson(updatedSupplier.getContactPerson());
                    supplier.setEmail(updatedSupplier.getEmail());
                    supplier.setPhone(updatedSupplier.getPhone());
                    supplier.setLeadTimeDays(updatedSupplier.getLeadTimeDays());
                    return ResponseEntity.ok(supplierRepository.save(supplier));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE: Remove supplier
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable Long id) {
        if (!supplierRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        supplierRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
