import axios from "axios";
import { AppConstants } from "../Util/Constants";

export const addCategory = async (category) => { 
    return await axios.post(`${AppConstants.BASE_URL}/api/v1.0/admin/categories`, category, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const deleteCategory = async (categoryId) => {
    return await axios.delete(`${AppConstants.BASE_URL}/api/v1.0/admin/categories/${categoryId}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const fetchCategories = async () => {
    return await axios.get(`${AppConstants.BASE_URL}/api/v1.0/categories`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}