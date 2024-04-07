import axios, { InternalAxiosRequestConfig } from "axios";
import {AxiosInstance} from "axios";
import AuthService from "./services/AuthService.ts";

async function onFulfilledHandler(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    if (config.url !== '/api/v1/refresh' && await new AuthService().checkAuth()) {
        const accessToken: string | null = localStorage.getItem('accessToken');
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
}
function onRejectedHandler(error: any): any {
    return Promise.reject(error);
}

const request: AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});
request.interceptors.request.use(onFulfilledHandler, onRejectedHandler);

export {
    request,
};