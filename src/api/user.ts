import { request } from "../axios.config.ts";
import { AxiosResponse } from "axios";
import { GetUsersResponse, User } from "../interfaces/user.ts";

async function find(userId: number): Promise<AxiosResponse<User>> {
  return request.get(`/api/v1/users/${userId}`)
    .then(response => response)
    .catch(error => error.response);
}

async function create(nick: string, password: string): Promise<AxiosResponse> {
  return await request
    .post('/api/v1/users', {
      nick,
      password,
      password_confirmation: password,
    })
    .then(response => response)
    .catch(error => error.response);
}

async function getUsers(nick: string, startId: number | null): Promise<AxiosResponse<GetUsersResponse>> {
  return await request
    .get('/api/v1/users', {
      params: { nick, startId },
    })
    .then(response => response)
    .catch(error => error.response);
}

export {
  find,
  create,
  getUsers,
}
