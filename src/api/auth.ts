import { request } from "../axios.config";
import { AxiosResponse } from "axios";
import { LoginResponse } from "../interfaces/auth";

async function login(nick: string, password: string): Promise<AxiosResponse<LoginResponse>> {
  return await request
    .post('/api/v1/login', { nick, password })
    .then(response => response)
    .catch(error => error.response);
}

async function refresh(refreshToken: string): Promise<AxiosResponse<LoginResponse>> {
  return await request
    .post('/api/v1/refresh', { refreshToken })
    .then(response => response)
    .catch(error => error.response)
}

export {
  login,
  refresh,
};