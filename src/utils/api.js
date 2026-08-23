import Axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/config";

const api = Axios.create({
    baseURL : API_BASE_URL,
    headers:{
        'Accept' : 'application/json',
        'Content-Type' : "application/json"
    }
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }

    return config;
});

export default api;
