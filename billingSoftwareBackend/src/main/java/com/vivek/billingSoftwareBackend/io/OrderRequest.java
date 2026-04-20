package com.vivek.billingSoftwareBackend.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class OrderRequest {

    private String customerName;
    private String phoneNumber;
    private List<OrderItemRequest> cartItems;
    private Double subtotal;
    private Double tax;
    private Double grandTotal;
    private String paymentMethod;
    // NEW: discount fields
    private Double discount;
    private Double discountPercent;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class OrderItemRequest {
        private String itemId;
        private String name;
        private Double price;
        private Integer quantity;
    }
}