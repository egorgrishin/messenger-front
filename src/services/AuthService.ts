import { login, refresh } from "../api/auth";
import { AxiosResponse } from "axios";
import { LoginResponse, PayloadAccessToken } from "../interfaces/auth";
import { create } from "../api/user";
import Notify from "../composables/notify.ts";

export default class AuthService {
  async login(nick: string, password: string): Promise<boolean> {
    const response: AxiosResponse<LoginResponse> = await login(nick, password);
    if (response.status === 200) {
      this.saveAuthData(response.data);
      return true;
    }

    Notify.send('Неправильный логин или пароль');
    return false;
  }

  async register(nick: string, password: string): Promise<boolean> {
    const response: AxiosResponse<any> = await create(nick, password);
    return response.status === 201;
  }

  async checkAuth(): Promise<boolean> {
    const accessToken: string | null = localStorage.getItem('accessToken');
    const refreshToken: string | null = localStorage.getItem('refreshToken');
    if (!accessToken || !refreshToken) {
      return false;
    }

    const now: number = Date.now() / 1000;
    const payload: PayloadAccessToken = this.getPayload(accessToken);

    return now >= payload.exp
      ? await this.refresh(refreshToken)
      : true;
  }

  async refresh(refreshToken: string): Promise<boolean> {
    const response: AxiosResponse<LoginResponse> = await refresh(refreshToken);
    if (response.status === 200) {
      this.saveAuthData(response.data);
      return true;
    }

    console.log(response);
    return false;
  }

  saveAuthData(data: LoginResponse): void {
    const payload: PayloadAccessToken = this.getPayload(data.accessToken);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userId', String(payload.id));
    localStorage.setItem('userNick', payload.nick);

    window.dispatchEvent(new CustomEvent('auth', {
      detail: {
        nick: payload.nick,
      },
    }));
  }

  getPayload(accessToken: string): PayloadAccessToken {
    const decodedPayload: string = atob(accessToken.split('.')[1]);
    return JSON.parse(decodedPayload);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userNick');

    window.dispatchEvent(new CustomEvent('auth', {
      detail: {
        nick: null,
      },
    }));
  }
}
