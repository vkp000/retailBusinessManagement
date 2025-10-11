package com.vivek.billingSoftwareBackend.service;

import com.razorpay.RazorpayException;
import com.vivek.billingSoftwareBackend.io.RazorpayOrderResponse;

public interface RazorpayService {


    RazorpayOrderResponse createOrder(Double amount, String currency) throws RazorpayException;;
}
