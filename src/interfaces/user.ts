import { AxiosResponse } from "axios";

export interface User {
  id: number,
  nick: string,
  createdAt: string,
  updatedAt: string,
}

export type AxiosGetUsers = AxiosResponse<{ data: User[] }>;
