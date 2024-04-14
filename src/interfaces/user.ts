interface User {
  id: number,
  nick: string,
  createdAt: string,
  updatedAt: string,
}

interface GetUsersResponse {
  data: User[],
}

export type {
  User,
  GetUsersResponse,
};