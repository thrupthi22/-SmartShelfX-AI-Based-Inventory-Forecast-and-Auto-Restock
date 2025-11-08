package com.smartshelf.smartshelf.controller;

import com.smartshelf.smartshelf.service.ForecastService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/forecast")
public class ForecastController {

    @Autowired
    private ForecastService forecastService;

    public static class ForecastDTO {
        public Long productId;
        public String productName;
        public int currentStock;
        public double predictedDemand;
        public String status;

        public ForecastDTO(Long productId, String productName, int currentStock, double predictedDemand, String status) {
            this.productId = productId;
            this.productName = productName;
            this.currentStock = currentStock;
            this.predictedDemand = predictedDemand;
            this.status = status;
        }
    }

    @GetMapping
    public List<ForecastDTO> getForecast() {
        // NOTICE: We are calling generateForecast(), NOT predictDemandForAllProducts()
        List<ForecastService.ForecastResult> serviceResults = forecastService.generateForecast();

        return serviceResults.stream()
                .map(result -> new ForecastDTO(
                        result.product.getId(),
                        result.product.getProductName(),
                        result.product.getQuantity(),
                        result.predictedSalesNextWeek,
                        mapRecommendationToStatus(result.recommendation)
                ))
                .collect(Collectors.toList());
    }

    private String mapRecommendationToStatus(String recommendation) {
        if (recommendation.startsWith("RESTOCK")) {
            return "RESTOCK NEEDED";
        } else if (recommendation.startsWith("OVERSTOCKED")) {
            return "OVERSTOCKED";
        } else {
            return "SUFFICIENT";
        }
    }
}