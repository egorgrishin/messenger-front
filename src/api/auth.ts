import { request } from "../axios.config.ts";
import { AxiosResponse } from "axios";

async function login(nick: string, password: string): Promise<AxiosResponse> {
  return await request
    .post('/api/v1/login', { nick, password })
    .then(response => response);
}

export {
  login,
};