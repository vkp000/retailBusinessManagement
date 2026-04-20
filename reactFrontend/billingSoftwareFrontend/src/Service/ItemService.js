import axios from "axios";
import { AppConstants } from "../Util/Constants";

const authHeader = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
});

export const addItem = async (item) => {
    return await axios.post(`${AppConstants.BASE_URL}/api/v1.0/admin/items`, item, authHeader());
}

export const deleteItem = async (itemId) => {
    return await axios.delete(`${AppConstants.BASE_URL}/api/v1.0/admin/items/${itemId}`, authHeader());
}

export const fetchItems = async () => {
    return await axios.get(`${AppConstants.BASE_URL}/api/v1.0/items`, authHeader());
}

export const updateItem = async (itemId, item) => {
    return await axios.put(`${AppConstants.BASE_URL}/api/v1.0/admin/items/${itemId}`, item, authHeader());
}

// Batch sync barcode mappings to backend
// Payload: [{ barcode, productId, isReassignment }]
export const syncBarcodes = async (mappings) => {
    return await axios.post(
        `${AppConstants.BASE_URL}/api/v1.0/admin/barcodes/sync`,
        { mappings },
        authHeader()
    );
}