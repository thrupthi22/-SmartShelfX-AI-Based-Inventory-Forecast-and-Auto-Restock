package com.smartshelf.smartshelf.repository;

import com.smartshelf.smartshelf.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    // Finds all POs, newest first
    List<PurchaseOrder> findAllByOrderByCreatedAtDesc();
}