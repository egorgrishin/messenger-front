import { AxiosGetUsers, User } from "interfaces/user";
import { apiCreateUser, apiGetUsers } from "api/user";
import Notify from "composables/notify.ts";
import { AxiosResponse } from "axios";

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
async function createUser(nick: string, password: string): Promise<boolean> {
  if (nick.length < 3) {
    Notify.send('Логин должен содержать не менее 3 символов');
    return false;
  }
  if (!password) {
    Notify.send('Пароль не может быть пустым');
    return false;
  }

  const response: AxiosResponse<any> = await apiCreateUser(nick, password);
  const isSuccess = response.status === 201;

  if (!isSuccess) {
    Notify.send('Ошибка регистрации');
  }
  return isSuccess;
}

export {
  getUsers,
  createUser,
};
