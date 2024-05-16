import { apiLogin, apiRefresh } from "api/auth";
import { AxiosLogin, LoginResponse, PayloadAccessToken } from "interfaces/auth";
import Notify from "composables/notify.ts";

/**
 * Авторизация
 */
async function login(nick: string, password: string): Promise<boolean> {
  const response: AxiosLogin = await apiLogin(nick, password);
  if (response.status === 200) {
    saveAuthData(response.data);
    return true;
  }
  Notify.send('Неправильный логин или пароль');
  return false;
}

/**
 * Выход из аккаунта
 */
function logout(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userNick');
  sendNick(null);
}

/**
 * Проверка авторизаии
 */
async function checkAuth(): Promise<boolean> {
  const accessToken: string | null = localStorage.getItem('accessToken');
  const refreshToken: string | null = localStorage.getItem('refreshToken');
  if (!accessToken || !refreshToken) {
    return false;
  }

  const now: number = Date.now() / 1000;
  const payload: PayloadAccessToken = getPayload(accessToken);

  return now >= payload.exp
    ? await refresh(refreshToken)
    : true;
}

/**
 * Обновляет пару токенов, используя refresh токен
 */
async function refresh(refreshToken: string): Promise<boolean> {
  const response: AxiosLogin = await apiRefresh(refreshToken);
  if (response.status === 200) {
    saveAuthData(response.data);
    return true;
  }
  logout();
  return false;
}

/**
 * Сохраняет авторизационные данные: токены, ID, nick
 */
function saveAuthData(data: LoginResponse): void {
  const payload: PayloadAccessToken = getPayload(data.accessToken);
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('userId', String(payload.id));
  localStorage.setItem('userNick', payload.nick);
  sendNick(payload.nick);
}

/**
 * Возвращает полезнуую нагрузку токена
 */
function getPayload(accessToken: string): PayloadAccessToken {
  const decodedPayload: string = atob(accessToken.split('.')[1]);
  return JSON.parse(decodedPayload);
}

/**
 * Отправляет событие для получения ника в шапке сайта
 */
function sendNick(nick: string | null): void {
  window.dispatchEvent(new CustomEvent('auth', {
    detail: {
      nick: nick,
    },
  }));
}

export {
  login,
  logout,
  checkAuth,
};
