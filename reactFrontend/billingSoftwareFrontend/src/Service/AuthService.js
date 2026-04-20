import axios from "axios";
import { AppConstants } from "../Util/Constants";

export const login = async (data) => {
    return await axios.post(`${AppConstants.BASE_URL}/api/v1.0/login`, data);
}