import { AxiosResponse } from "axios";

export interface User {
  id: number,
  nick: string,
  avatarUrl: string,
  createdAt: string,
  updatedAt: string,
}

export type AxiosGetUsers = AxiosResponse<{ data: User[] }>;
export type AxiosUpdateUsers = AxiosResponse<{ data: User }>;

export type AxiosVerifyEmail = AxiosResponse<{ data: { retry: number } }>;
