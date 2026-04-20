package com.vivek.billingSoftwareBackend.service.impl;

import com.vivek.billingSoftwareBackend.entity.OrderEntity;
import com.vivek.billingSoftwareBackend.entity.OrderItemEntity;
import com.vivek.billingSoftwareBackend.io.*;
import com.vivek.billingSoftwareBackend.repository.OrderEntityRepository;
import com.vivek.billingSoftwareBackend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderEntityRepository orderEntityRepository;

    // FIX: Secret inject kiya real signature verification ke liye
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Override
    public OrderResponse createdOrder(OrderRequest request) {
        OrderEntity newOrder = convertToOrderEntity(request);

        PaymentDetails paymentDetails = new PaymentDetails();
        paymentDetails.setStatus(newOrder.getPaymentMethod() == PaymentMethod.CASH
                ? PaymentDetails.PaymentStatus.COMPLETED
                : PaymentDetails.PaymentStatus.PENDING);
        newOrder.setPaymentDetails(paymentDetails);

        List<OrderItemEntity> orderItems = request.getCartItems().stream()
                .map(this::convertToOrderItemEntity)
                .collect(Collectors.toList());
        newOrder.setItems(orderItems);

        newOrder = orderEntityRepository.save(newOrder);
        return convertToResponse(newOrder);
    }

    private OrderItemEntity convertToOrderItemEntity(OrderRequest.OrderItemRequest orderItemRequest) {
        return OrderItemEntity.builder()
                .itemId(orderItemRequest.getItemId())
                .name(orderItemRequest.getName())
                .price(orderItemRequest.getPrice())
                .quantity(Double.valueOf(orderItemRequest.getQuantity()))
                .build();
    }

    private OrderEntity convertToOrderEntity(OrderRequest request) {
        return OrderEntity.builder()
                .customerName(request.getCustomerName())
                .phoneNumber(request.getPhoneNumber())
                .subtotal(request.getSubtotal())
                .tax(request.getTax())
                .grandTotal(request.getGrandTotal())
                // NEW: discount save
                .discount(request.getDiscount() != null ? request.getDiscount() : 0.0)
                .discountPercent(request.getDiscountPercent() != null ? request.getDiscountPercent() : 0.0)
                .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()))
                .build();
    }

    private OrderResponse convertToResponse(OrderEntity newOrder) {
        return OrderResponse.builder()
                .orderId(newOrder.getOrderId())
                .customerName(newOrder.getCustomerName())
                .phoneNumber(newOrder.getPhoneNumber())
                .subtotal(newOrder.getSubtotal())
                .tax(newOrder.getTax())
                .grandTotal(newOrder.getGrandTotal())
                // NEW: discount in response
                .discount(newOrder.getDiscount())
                .discountPercent(newOrder.getDiscountPercent())
                .paymentMethod(newOrder.getPaymentMethod())
                .items(newOrder.getItems().stream()
                        .map(this::convertToItemResponse)
                        .collect(Collectors.toList()))
                .paymentDetails(newOrder.getPaymentDetails())
                .createdAt(newOrder.getCreatedAt())
                .build();
    }


    private OrderResponse.OrderItemResponse convertToItemResponse(OrderItemEntity orderItemEntity) {
        return OrderResponse.OrderItemResponse.builder()
                .itemId(orderItemEntity.getItemId())
                .name(orderItemEntity.getName())
                .price(orderItemEntity.getPrice())
                .quantity(orderItemEntity.getQuantity())
                .build();
    }

    @Override
    public void deleteOrder(String orderId) {
        OrderEntity existingOrder = orderEntityRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        orderEntityRepository.delete(existingOrder);
    }

    @Override
    public List<OrderResponse> getLatestOrders() {
        return orderEntityRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse verifyPayment(PaymentVerificationRequest request) {
        OrderEntity existingOrder = orderEntityRepository.findByOrderId(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!verifyRazorpaySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature())) {
            throw new RuntimeException("Payment verification failed");
        }

        PaymentDetails paymentDetails = existingOrder.getPaymentDetails();
        paymentDetails.setRazorpayOrderId(request.getRazorpayOrderId());
        paymentDetails.setRazorpayPaymentId(request.getRazorpayPaymentId());
        paymentDetails.setRazorpaySignature(request.getRazorpaySignature());
        paymentDetails.setStatus(PaymentDetails.PaymentStatus.COMPLETED);

        existingOrder = orderEntityRepository.save(existingOrder);
        return convertToResponse(existingOrder);
    }

    @Override
    public Double sumSalesByDate(LocalDate date) {
        return orderEntityRepository.sumSalesByDate(date);
    }

    @Override
    public Long countByOrderDate(LocalDate date) {
        return orderEntityRepository.countByOrderDate(date);
    }

    @Override
    public List<OrderResponse> findRecentOrders() {
        return orderEntityRepository.findRecentOrders(PageRequest.of(0, 5))
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * FIX: Real HMAC-SHA256 verification — was always returning true (critical security hole)
     * Razorpay signature = HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)
     */
    private boolean verifyRazorpaySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(razorpayKeySecret.getBytes("UTF-8"), "HmacSHA256");
            mac.init(secretKey);
            byte[] hashBytes = mac.doFinal(payload.getBytes("UTF-8"));
            String generatedSignature = bytesToHex(hashBytes);
            return generatedSignature.equals(razorpaySignature);
        } catch (Exception e) {
            return false;
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}