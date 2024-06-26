import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AxiosInstance } from "axios";
import { checkAuth } from "services/authService.ts";
import Notify from "composables/notify.ts";

const host: string = import.meta.env.VITE_HOST ?? 'http://127.0.0.1'
const port: number = import.meta.env.PROD ? 9001 : 80;
const request: AxiosInstance = axios.create({
  baseURL: host + ':' + port,
});

request.interceptors.request.use(onRequestFulfilledHandler);
request.interceptors.response.use(
  (response: AxiosResponse) => Promise.resolve(response),
  onResponseRejectedHandler
);

/**
 * Обработчик успешного выполнения запроса
 */
async function onRequestFulfilledHandler(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  if (config.url !== '/api/v1/refresh' && await checkAuth()) {
    const accessToken: string | null = localStorage.getItem('accessToken');
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
}

/**
 * Обработчик ответа с ошибкой
 */
function onResponseRejectedHandler(error: AxiosError): Promise<AxiosError> {
  if (error.code === 'ERR_NETWORK') {
    Notify.send('Нет соединения с сервером');
  }
  return Promise.reject(error)
}

export {
  request,
};