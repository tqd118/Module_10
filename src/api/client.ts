import axios from "axios";
import { BASE_PATH } from "@/config/basePath";

const client = axios.create({
    baseURL: `/api`,
});

client.interceptors.request.use((config) => {
    if (typeof localStorage !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default client;