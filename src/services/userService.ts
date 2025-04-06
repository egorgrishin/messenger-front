import { AxiosGetUsers, AxiosUpdateUsers, User } from "interfaces/user";
import {
  apiCreateUser,
  apiDeleteAvatar,
  apiGetUsers,
  apiResetPassword,
  apiSendEmailCode,
  apiUpdateAvatar, apiUpdateUser
} from "api/user";
import Notify from "composables/notify.ts";
import { AxiosResponse } from "axios";
import { refresh } from "services/authService.ts";

/**
 * Возвращает список пользователей с фильтрацией по нику с ID меньше указанного
 */
async function getUsers(nick: string, startId: number | null = null): Promise<User[] | null> {
  if (!nick) {
    Notify.send('Введите имя пользователя');
    return null;
  }

  const response: AxiosGetUsers = await apiGetUsers(nick, startId);
  if (response.status === 200) {
    return response.data.data;
  }

  Notify.send('Не удалось загрузить пользователей');
  return null;
}

/**
 * Создает нового пользователя
 */
async function createUser(nick: string, email: string, code: string, password: string, passwordConfirmation: string): Promise<boolean> {
  if (!nick.length) {
    Notify.send('Имя не может быть пустым');
    return false;
  }
  if (!code.length) {
    Notify.send('Код подтверждения не может быть пустым');
    return false;
  }
  if (email.length < 3) {
    Notify.send('Адрес электронной почты должен содержать не менее 3 символов');
    return false;
  }
  if (!password) {
    Notify.send('Пароль не может быть пустым');
    return false;
  }
  if (password !== passwordConfirmation) {
    Notify.send('Пароли не совпадают');
    return false;
  }

  const response: AxiosResponse<any> = await apiCreateUser(nick, email, code, password, passwordConfirmation);
  const isSuccess = response.status === 201;

  if (!isSuccess) {
    Notify.send('Ошибка регистрации. ' + response.data.message);
  }

  return isSuccess;
}

/**
 * Обновляет пользователя
 */
async function updateUser(userId: number, nick: string): Promise<User | null> {
  if (!nick.length) {
    Notify.send('Имя не может быть пустым');
    return null;
  }

  const response: AxiosUpdateUsers = await apiUpdateUser(userId, nick);
  const isSuccess = response.status === 200;

  if (!isSuccess) {
    Notify.send('Ошибка сохранения');
    return null;
  }

  await updateUserStorage();
  Notify.sendGreen('Сохранено');
  return response.data.data;
}

async function updateAvatar(userId: number, avatar: File): Promise<boolean> {
  const response: AxiosResponse = await apiUpdateAvatar(userId, avatar);
  if (response.status === 204) {
    await updateUserStorage();
    Notify.sendGreen('Аватар успешно обновлен');
    return true;
  }

  Notify.sendRed('Не удалось обновить аватар');
  return false;
}

async function deleteAvatar(userId: number): Promise<boolean> {
  const response: AxiosResponse = await apiDeleteAvatar(userId);
  if (response.status === 204) {
    await updateUserStorage();
    Notify.sendGreen('Аватар успешно удален');
    return true;
  }

  Notify.sendRed('Не удалось удалить аватар');
  return false;
}

async function updateUserStorage(): Promise<void> {
  const refreshToken: string | null = localStorage.getItem('refreshToken');
  if (refreshToken) {
    await refresh(refreshToken);
  }
}

/**
 * Сбрасывает пароль от аккаунта пользователя
 */
async function resetPassword(email: string | null, code: string, password: string, passwordConfirm: string): Promise<boolean> {
  if (!code.length) {
    Notify.send('Код подтверждения не может быть пустым');
    return false;
  }
  if (email !== null && email.length < 3) {
    Notify.send('Адрес электронной почты должен содержать не менее 3 символов');
    return false;
  }
  if (!password) {
    Notify.send('Пароль не может быть пустым');
    return false;
  }
  if (password !== passwordConfirm) {
    Notify.send('Пароли не совпадают');
    return false;
  }

  const response: AxiosResponse<any> = await apiResetPassword(email, code, password, passwordConfirm);
  const isSuccess = response.status === 200;

  if (!isSuccess) {
    Notify.send('Ошибка сброса пароля. ' + response.data.message);
  }

  return isSuccess;
}

/**
 * Отправляет письмо для подтверждения email
 */
async function sendEmailCode(email: string | null = null): Promise<[number?, number?]> {
  if (email !== null && email.length < 3) {
    Notify.send('Адрес электронной почты должен содержать не менее 3 символов');
    return [];
  }

  let response: AxiosResponse<any> = await apiSendEmailCode(email);
  const isSuccess = response.status === 201;
  const retryDefault = 120;

  if (!isSuccess) {
    Notify.send('Не удалось отправить письмо');
    if (response.status === 422) {
      return [0];
    }

    return response.data.code === 'TIME_NOT_PASSED'
      ? [response.data.retry || retryDefault, response.data.passed || 0]
      : [retryDefault];
  }

  return [response.data.data.retry || retryDefault, 0];
}

export {
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
  deleteAvatar,
  resetPassword,
  sendEmailCode,
};
