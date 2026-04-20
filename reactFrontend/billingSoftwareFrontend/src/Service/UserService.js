import axios from "axios";
import { AppConstants } from "../Util/Constants";

export const addUser = async (user) => {
    return await axios.post(`${AppConstants.BASE_URL}/api/v1.0/admin/register`, user, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const deleteUser = async (id) => {
    return await axios.delete(`${AppConstants.BASE_URL}/api/v1.0/admin/users/${id}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const fetchUsers = async () => {
    return await axios.get(`${AppConstants.BASE_URL}/api/v1.0/admin/users`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}