package com.vivek.billingSoftwareBackend.controller;

import com.razorpay.RazorpayException;
import com.vivek.billingSoftwareBackend.io.OrderResponse;
import com.vivek.billingSoftwareBackend.io.PaymentRequest;
import com.vivek.billingSoftwareBackend.io.PaymentVerificationRequest;
import com.vivek.billingSoftwareBackend.io.RazorpayOrderResponse;
import com.vivek.billingSoftwareBackend.service.OrderService;
import com.vivek.billingSoftwareBackend.service.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayService razorpayService;
    private final OrderService orderService;

    @PostMapping("/create-order")
    @ResponseStatus(HttpStatus.CREATED)
    public RazorpayOrderResponse createRazorpayOrder(@RequestBody PaymentRequest request) throws RazorpayException {

        return razorpayService.createOrder(request.getAmount(), request.getCurrency());

    }

    @PostMapping("/verify")
    public OrderResponse verifyPayment(@RequestBody PaymentVerificationRequest request) {
        return orderService.verifyPayment(request);
    }

}