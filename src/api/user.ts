import { request } from "@/axios.config";
import { AxiosResponse } from "axios";
import { AxiosGetUsers } from "interfaces/user";

/**
 * Отправляет GET запрос на получение списка пользователей с фильтрацией по нику и ID меньше указанного
 */
export async function apiGetUsers(nick: string, startId: number | null): Promise<AxiosGetUsers> {
  return await request
    .get('/api/v1/users', {
      params: { nick, startId },
    })
    .then((response: AxiosGetUsers) => response)
    .catch((error: any) => error.response);
}

/**
 * Отправляет POST запрос на создание нового пользователя
 */
export async function apiCreateUser(nick: string, password: string): Promise<AxiosResponse> {
  return await request
    .post('/api/v1/users', {
      nick,
      password,
      password_confirmation: password,
    })
    .then((response: AxiosResponse<any>) => response)
    .catch((error: any) => error.response);
}
