package com.smartshelf.smartshelf.repository;

import com.smartshelf.smartshelf.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    // Find all POs with a specific status (e.g., find all "PENDING" for the dashboard)
    List<PurchaseOrder> findByStatus(PurchaseOrder.Status status);
}
