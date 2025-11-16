package com.smartshelf.smartshelf.controller;

import com.smartshelf.smartshelf.model.Product;
import com.smartshelf.smartshelf.model.PurchaseOrder;
import com.smartshelf.smartshelf.repository.ProductRepository;
import com.smartshelf.smartshelf.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

// --- CRITICAL FIX: IMPORT THE NEW DTO from the DTO package ---
import com.smartshelf.smartshelf.dto.PurchaseOrderRequest; // This is the single, correct reference
// ----------------------------------------

// This allows you to use PENDING, APPROVED, ORDERED, RECEIVED directly
import static com.smartshelf.smartshelf.model.OrderStatus.*;


@RestController
@RequestMapping("/api/pos")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderRepository poRepository;

    @Autowired
    private ProductRepository productRepository;

    // 1. Get all Purchase Orders
    @GetMapping
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return poRepository.findAllByOrderByCreatedAtDesc();
    }

    // 2. Create a new PENDING Purchase Order
    @PostMapping
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(@RequestBody PurchaseOrderRequest poRequest) {
        Optional<Product> productOpt = productRepository.findById(poRequest.productId);

        // Return 400 Bad Request if product ID is invalid
        if (productOpt.isEmpty()) {
            return ResponseEntity.badRequest().<PurchaseOrder>build();
        }

        PurchaseOrder newPO = new PurchaseOrder();
        newPO.setProduct(productOpt.get());
        newPO.setQuantity(poRequest.quantity);
        newPO.setStatus(PENDING);
        newPO.setCreatedAt(Instant.now());

        PurchaseOrder savedPO = poRepository.save(newPO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPO);
    }

    // 3. Approve a PENDING order (Pending -> APPROVED)
    @PutMapping("/{id}/approve")
    public ResponseEntity<PurchaseOrder> approvePurchaseOrder(@PathVariable Long id) {
        Optional<PurchaseOrder> poOpt = poRepository.findById(id);

        if (poOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PurchaseOrder po = poOpt.get();

        // Check if the order is ready for approval
        if (po.getStatus() != PENDING) {
            return ResponseEntity.<PurchaseOrder>badRequest().build();
        }

        po.setStatus(APPROVED);
        PurchaseOrder updatedPO = poRepository.save(po);
        return ResponseEntity.ok(updatedPO);
    }

    // 4. Mark an APPROVED/ORDERED order as received (-> RECEIVED)
    @PutMapping("/{id}/receive")
    public ResponseEntity<PurchaseOrder> receivePurchaseOrder(@PathVariable Long id) {
        Optional<PurchaseOrder> poOpt = poRepository.findById(id);

        if (poOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PurchaseOrder po = poOpt.get();

        // Check if it's currently approved or ordered before receiving
        if (po.getStatus() != APPROVED && po.getStatus() != ORDERED) {
            return ResponseEntity.<PurchaseOrder>badRequest().build();
        }

        // --- CRITICAL: UPDATE THE INVENTORY ---
        Product product = po.getProduct();
        int newQuantity = product.getQuantity() + po.getQuantity();
        product.setQuantity(newQuantity);
        productRepository.save(product);
        // --- INVENTORY UPDATED ---

        po.setStatus(RECEIVED);
        PurchaseOrder updatedPO = poRepository.save(po);
        return ResponseEntity.ok(updatedPO);
    }
}