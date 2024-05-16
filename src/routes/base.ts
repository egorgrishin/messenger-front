import { checkAuth } from "services/authService.ts";

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