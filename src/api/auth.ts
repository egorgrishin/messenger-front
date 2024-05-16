import { request } from "@/axios.config";
import { AxiosLogin } from "interfaces/auth";

/**
 * Отправляет POST запрос на авторизацию
 */
export async function apiLogin(nick: string, password: string): Promise<AxiosLogin> {
  return await request
    .post('/api/v1/login', { nick, password })
    .then((response: AxiosLogin) => response)
    .catch((error: any) => error.response);
}

/**
 * Отправляет POST запрос на обновление refresh и access токенов
 */
export async function apiRefresh(refreshToken: string): Promise<AxiosLogin> {
  return await request
    .post('/api/v1/refresh', { refreshToken })
    .then((response: AxiosLogin) => response)
    .catch((error: any) => error.response)
}
