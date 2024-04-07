interface LoginResponse {
  accessToken: string,
  refreshToken: string,
}

interface PayloadAccessToken {
  id: number,
  nick: string,
  exp: number,
}

export type {
  LoginResponse,
  PayloadAccessToken,
};