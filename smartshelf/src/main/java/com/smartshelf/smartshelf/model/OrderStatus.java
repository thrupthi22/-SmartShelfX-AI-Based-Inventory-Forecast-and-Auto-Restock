package com.smartshelf.smartshelf.model;

/**
 * Represents the status of a Purchase Order.
 * PENDING:  AI suggested it, or manager created it. Awaiting approval.
 * APPROVED: Manager has approved the PO. Ready to be sent to supplier.
 * ORDERED:  PO has been sent to the supplier.
 * RECEIVED: Stock has arrived and has been added to the inventory.
 */
public enum OrderStatus {
    PENDING,
    APPROVED,
    ORDERED,
    RECEIVED
}