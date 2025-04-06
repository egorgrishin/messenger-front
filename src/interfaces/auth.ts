import { AxiosResponse } from "axios";

export interface PayloadAccessToken {
  id: number,
  nick: string,
  avatarUrl: string | null,
  exp: number,
}

export interface LoginResponse {
  accessToken: string,
  refreshToken: string,
}

export type AxiosLogin = AxiosResponse<LoginResponse>;
