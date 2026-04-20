import axios from "axios";
import { AppConstants } from "../Util/Constants";

export const createRazorpayOrder = async (data) => {
    return await axios.post(`${AppConstants.BASE_URL}/api/v1.0/payments/create-order`, data, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
}

export const verifyPayment = async (paymentData) => {
    return await axios.post(`${AppConstants.BASE_URL}/api/v1.0/payments/verify`, paymentData, 
        {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
}