package com.smartshelf.smartshelf.service;

import com.smartshelf.smartshelf.model.Product;
import com.smartshelf.smartshelf.model.Sales;
import com.smartshelf.smartshelf.repository.ProductRepository;
import com.smartshelf.smartshelf.repository.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ForecastService {

    @Autowired
    private SalesRepository salesRepository;
    @Autowired
    private ProductRepository productRepository;

    // This inner class will hold our prediction data
    public static class ForecastResult {
        public Product product;
        public double predictedSalesNextWeek;
        public String recommendation;

        public ForecastResult(Product product, double predictedSalesNextWeek, String recommendation) {
            this.product = product;
            this.predictedSalesNextWeek = predictedSalesNextWeek;
            this.recommendation = recommendation;
        }
    }

    public List<ForecastResult> generateForecast() {
        List<ForecastResult> forecasts = new ArrayList<>();
        List<Product> allProducts = productRepository.findAll();

        // 1. Define the time window for analysis (e.g., last 30 days)
        Instant endDate = Instant.now();
        Instant startDate = endDate.minus(30, ChronoUnit.DAYS);

        // 2. Get all sales in that window
        List<Sales> recentSales = salesRepository.findBySaleDateBetween(startDate, endDate);

        // 3. Group sales by Product ID
        Map<Long, Integer> salesPerProduct = new HashMap<>();
        for (Sales sale : recentSales) {
            Long productId = sale.getProduct().getId();
            salesPerProduct.put(productId, salesPerProduct.getOrDefault(productId, 0) + sale.getQuantitySold());
        }

        // 4. Calculate forecast for each product
        for (Product product : allProducts) {
            // Get total sales for last 30 days (default to 0 if no sales)
            int totalSalesLast30Days = salesPerProduct.getOrDefault(product.getId(), 0);

            // --- THE "AI" ALGORITHM (Simple Moving Average) ---
            // If we sold X items in 30 days, we predict we'll sell (X / 30) * 7 items next week.
            double dailyAverage = totalSalesLast30Days / 30.0;
            double predictedNextWeek = dailyAverage * 7.0;

            // 5. Generate Recommendation
            String recommendation = "Stable";
            if (product.getQuantity() < predictedNextWeek) {
                recommendation = "RESTOCK SOON: Stock is less than predicted demand.";
            } else if (product.getQuantity() > predictedNextWeek * 4) {
                recommendation = "OVERSTOCKED: Consider a sale.";
            }

            forecasts.add(new ForecastResult(product, Math.round(predictedNextWeek * 10.0) / 10.0, recommendation));
        }

        // Sort by highest predicted sales first
        forecasts.sort((a, b) -> Double.compare(b.predictedSalesNextWeek, a.predictedSalesNextWeek));

        return forecasts;
    }
}
