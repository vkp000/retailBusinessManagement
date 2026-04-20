package com.vivek.billingSoftwareBackend.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class OrderResponse {

    private String orderId;
    private String customerName;
    private String phoneNumber;
    private List<OrderResponse.OrderItemResponse> items;
    private Double subtotal;
    private Double tax;
    private Double grandTotal;
    // NEW: discount fields
    private Double discount;
    private Double discountPercent;
    private PaymentMethod paymentMethod;
    private LocalDateTime createdAt;
    private PaymentDetails paymentDetails;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class OrderItemResponse {
        private String itemId;
        private String name;
        private Double price;
        private Double quantity;
    }
}