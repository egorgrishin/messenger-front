import { checkAuth } from "services/AuthService";

export default [
  {
    path: '/',
    name: 'home',
    beforeEnter: async (): Promise<{ name: string }> => {
      return await checkAuth()
        ? { name: 'chat.list' }
        : { name: 'login' };
    },
  },
];