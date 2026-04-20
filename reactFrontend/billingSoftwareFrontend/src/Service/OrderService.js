import axios from "axios";
import { AppConstants } from "../Util/Constants";


export const latestOrders = async () => {
    return await axios.get(`${AppConstants.BASE_URL}/api/v1.0/orders/latest`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
}

export const createOrder = async (order) => {
    return await axios.post(`${AppConstants.BASE_URL}/api/v1.0/orders`, order, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
}

export const deleteOrder = async (id) => {
    return await axios.delete(`${AppConstants.BASE_URL}/api/v1.0/orders/${id}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
}