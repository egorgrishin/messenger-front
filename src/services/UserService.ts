import { GetUsersResponse, User } from "../interfaces/user";
import { AxiosResponse } from "axios";
import { getUsers } from "../api/user.ts";

export default class UserService {
  async getUsers(nick: string, startId: number | null = null): Promise<User[] | null> {
    const response: AxiosResponse<GetUsersResponse> = await getUsers(nick, startId);
    if (response.status === 200) {
      return response.data.data;
    }

    console.log(response);
    return null;
  }
}