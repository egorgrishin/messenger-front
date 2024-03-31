import { request } from "../axios.config.ts";
import { AxiosResponse } from "axios";

async function create(nick: string, password: string): Promise<AxiosResponse> {
  return await request
    .post('/api/v1/users', {
      nick,
      password,
      password_confirmation: password,
    })
    .then(response => response)
}

export {
  create,
}
