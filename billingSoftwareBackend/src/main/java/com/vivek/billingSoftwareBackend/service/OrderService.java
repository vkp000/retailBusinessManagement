package com.vivek.billingSoftwareBackend.service;

import com.vivek.billingSoftwareBackend.io.OrderRequest;
import com.vivek.billingSoftwareBackend.io.OrderResponse;
import com.vivek.billingSoftwareBackend.io.PaymentVerificationRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface OrderService {

    OrderResponse createdOrder(OrderRequest request) ;

    void deleteOrder(String orderId);

    List<OrderResponse> getLatestOrders();

    OrderResponse verifyPayment(PaymentVerificationRequest request);

    Double sumSalesByDate(LocalDate date);

    Long countByOrderDate(LocalDate date);

    List<OrderResponse> findRecentOrders();

//    List<OrderResponse> findRecentOrders(Pageable pageable);
}
