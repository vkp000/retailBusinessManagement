import axios from "axios";
import { AppConstants } from "../Util/Constants";

export const fetchDashboardData = async () => { 
    return await axios.get(`${AppConstants.BASE_URL}/api/v1.0/dashboard`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
}