import { AxiosResponse } from "axios";

export interface PayloadAccessToken {
  id: number,
  nick: string,
  exp: number,
}

export interface LoginResponse {
  accessToken: string,
  refreshToken: string,
}

export type AxiosLogin = AxiosResponse<LoginResponse>;
