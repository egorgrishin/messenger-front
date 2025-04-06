import { request } from "@/axios.config";
import { AxiosResponse } from "axios";
import { AxiosGetUsers, AxiosUpdateUsers, AxiosVerifyEmail } from "interfaces/user";
import { AxiosCreateFile } from "interfaces/file.ts";

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
export async function apiCreateUser(nick: string, email: string, code: string, password: string, passwordConfirmation: string): Promise<AxiosResponse> {
  return await request
    .post('/api/v1/users', {
      nick,
      email,
      code,
      password,
      passwordConfirmation,
    })
    .then((response: AxiosResponse) => response)
    .catch((error: any) => error.response);
}

/**
 * Отправляет PUT запрос на обновление пользователя
 */
export async function apiUpdateUser(userId: number, nick: string): Promise<AxiosUpdateUsers> {
  return await request
    .put(`/api/v1/users/${userId}`, { nick })
    .then((response: AxiosUpdateUsers) => response)
    .catch((error: any) => error.response);
}

/**
 * Отправляет PUT (POST) запрос на обновление аватара пользователя
 */
export async function apiUpdateAvatar(userId: number, avatar: File): Promise<AxiosResponse> {
  const formData = new FormData();
  formData.append('avatar', avatar);
  formData.append('_method', 'PUT');

  return await request
    .post(`/api/v1/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response: AxiosCreateFile) => response)
    .catch((error: any) => error.response);
}

/**
 * Отправляет DELETE запрос на удаление аватара пользователя
 */
export async function apiDeleteAvatar(userId: number) {
  return await request
    .delete(`/api/v1/users/${userId}/avatar`)
    .then((response: AxiosResponse) => response)
    .catch((error: any) => error.response);
}

/**
 * Отправляет POST запрос насброс пароля пользователя
 */
export async function apiResetPassword(email: string | null, code: string, password: string, passwordConfirmation: string): Promise<AxiosResponse> {
  return await request
    .post('/api/v1/users/reset', {
      email,
      code,
      password,
      passwordConfirmation,
    })
    .then((response: AxiosResponse) => response)
    .catch((error: any) => error.response);
}

/**
 * Отправляет POST запрос на подтверждение адреса электронной почты
 */
export async function apiSendEmailCode(email: string | null): Promise<AxiosVerifyEmail> {
  return await request
    .post('/api/v1/users/verify', {
      email,
    })
    .then((response: AxiosVerifyEmail) => response)
    .catch((error: any) => error.response);
}
