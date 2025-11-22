package com.smartshelf.smartshelf.controller;

import com.smartshelf.smartshelf.model.Sales;
import com.smartshelf.smartshelf.model.PurchaseOrder;
import com.smartshelf.smartshelf.model.OrderStatus;
import com.smartshelf.smartshelf.repository.SalesRepository;
import com.smartshelf.smartshelf.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private PurchaseOrderRepository poRepository;

    // Formatter to group sales/purchases by month (e.g., Nov 2025)
    private static final DateTimeFormatter MONTH_FORMATTER = DateTimeFormatter.ofPattern("MMM yyyy");

    // --- DTO for Analytic Charts (Frontend Input) ---
    public static class AnalyticsDTO {
        public List<Map<String, Object>> monthlySalesVsPurchases;
        public List<Map<String, Object>> topProductsByRevenue;
        public Map<String, Double> supplierPurchaseCosts;
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsDTO> getAnalyticsData() {
        AnalyticsDTO dto = new AnalyticsDTO();

        // Fetch all necessary data
        List<Sales> allSales = salesRepository.findAll();
        List<PurchaseOrder> receivedPOs = poRepository.findAll().stream()
                .filter(po -> po.getStatus() == OrderStatus.RECEIVED) // Only count completed/received orders
                .collect(Collectors.toList());

        // 1. Monthly Sales vs. Purchases (Bar Chart Data)
        Map<String, Double> monthlySales = aggregateSalesByMonth(allSales);
        Map<String, Double> monthlyPurchases = aggregatePurchasesByMonth(receivedPOs);
        dto.monthlySalesVsPurchases = createCombinedMonthlyData(monthlySales, monthlyPurchases);

        // 2. Top Selling Products (Pie Chart Data)
        dto.topProductsByRevenue = aggregateTopProducts(allSales, 5);

        // 3. Supplier Performance Costs (Used on Supplier Management Page)
        dto.supplierPurchaseCosts = aggregateSupplierCosts(receivedPOs);

        return ResponseEntity.ok(dto);
    }

    /**
     * Aggregates total purchase cost (Product Price * Quantity) for all RECEIVED POs, grouped by supplier name.
     */
    private Map<String, Double> aggregateSupplierCosts(List<PurchaseOrder> receivedPOs) {
        return receivedPOs.stream()
                .collect(Collectors.groupingBy(
                        po -> po.getProduct().getSupplier(), // Group by the supplier name stored in the Product
                        Collectors.summingDouble(po -> {
                            // Use a fallback to 0 if price or quantity is unexpectedly null/zero, although fields are non-nullable
                            double price = po.getProduct() != null ? po.getProduct().getPrice() : 0.0;
                            int quantity = po.getQuantity();
                            return price * quantity;
                        })
                ))
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> Math.round(entry.getValue() * 100.0) / 100.0 // Round to two decimal places
                ));
    }

    private Map<String, Double> aggregateSalesByMonth(List<Sales> sales) {
        return sales.stream()
                .collect(Collectors.groupingBy(
                        sale -> MONTH_FORMATTER.format(sale.getSaleDate().atZone(ZoneId.systemDefault())),
                        // FIX 1: Access price via sale.getProduct().getPrice()
                        Collectors.summingDouble(sale -> sale.getProduct().getPrice() * sale.getQuantitySold())
                ));
    }

    private Map<String, Double> aggregatePurchasesByMonth(List<PurchaseOrder> receivedPOs) {
        return receivedPOs.stream()
                .collect(Collectors.groupingBy(
                        po -> MONTH_FORMATTER.format(po.getCreatedAt().atZone(ZoneId.systemDefault())),
                        Collectors.summingDouble(po -> po.getProduct().getPrice() * po.getQuantity()) // Estimate Purchase cost
                ));
    }

    private List<Map<String, Object>> createCombinedMonthlyData(Map<String, Double> sales, Map<String, Double> purchases) {
        Set<String> allMonths = new HashSet<>();
        allMonths.addAll(sales.keySet());
        allMonths.addAll(purchases.keySet());

        // This sorting is crude (string comparison) but better than random ordering
        return allMonths.stream()
                .map(month -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("month", month);
                    data.put("SalesRevenue", Math.round(sales.getOrDefault(month, 0.0) * 100.0) / 100.0);
                    data.put("PurchaseCost", Math.round(purchases.getOrDefault(month, 0.0) * 100.0) / 100.0);
                    return data;
                })
                .sorted((a, b) -> ((String) a.get("month")).compareTo((String) b.get("month")))
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> aggregateTopProducts(List<Sales> sales, int limit) {
        Map<String, Double> productRevenue = sales.stream()
                .collect(Collectors.groupingBy(
                        sale -> sale.getProduct().getProductName(),
                        // FIX 2: Access price via sale.getProduct().getPrice()
                        Collectors.summingDouble(sale -> sale.getProduct().getPrice() * sale.getQuantitySold())
                ));

        return productRevenue.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue(Comparator.reverseOrder()))
                .limit(limit)
                .map(entry -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("name", entry.getKey());
                    data.put("value", Math.round(entry.getValue() * 100.0) / 100.0);
                    return data;
                })
                .collect(Collectors.toList());
    }
}