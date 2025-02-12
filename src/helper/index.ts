import Echo from "laravel-echo";

/**
 * Возвращает объект Echo с установленным токеном авторизации
 */
export function getEcho(): Echo {
  const accessToken: string | null = localStorage.getItem('accessToken');
  window.Echo.connector.options.auth.headers.Authorization = `Bearer ${accessToken}`;

  return window.Echo;
}