import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AxiosInstance } from "axios";
import { checkAuth } from "services/AuthService";
import Notify from "composables/notify.ts";

const request: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:80',
});

async function onFulfilledHandler(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  if (config.url !== '/api/v1/refresh' && await checkAuth()) {
    const accessToken: string | null = localStorage.getItem('accessToken');
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
}

function onRejectedHandler(error: any): any {
  return Promise.reject(error);
}

request.interceptors.request.use(onFulfilledHandler, onRejectedHandler);
request.interceptors.response.use(
  (response: AxiosResponse) => Promise.resolve(response),
  (error: AxiosError) => {
    if (error.code === 'ERR_NETWORK') {
      Notify.send('Нет соединения с сервером');
    }
    return Promise.reject(error)
  }
);

export {
  request,
};