import Axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/config";

const imageUploadApi = Axios.create({
    baseURL : API_BASE_URL,
    headers:{
        'Accept' : 'application/json',
        'Content-Type' : "multipart/form-data"
    }
});

imageUploadApi.interceptors.request.use((config) => {
    const token = Cookies.get('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }

    return config;
});

export default imageUploadApi;
