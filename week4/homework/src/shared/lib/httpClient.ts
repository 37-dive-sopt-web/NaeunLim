import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!API_BASE_URL) {
    console.warn("API_BASE_URL is not defined. Please set VITE_API_BASE_URL.")
}

export const httpClient = axios.create({
    baseURL: API_BASE_URL,
    // 쿠키 기반 인증이 필요할 때 브라우저가 쿠키를 함께 보냄
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})