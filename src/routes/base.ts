import { checkAuth } from "services/authService.ts";

// noinspection JSUnusedGlobalSymbols
export default [
  {
    path: '/',
    name: 'home',
    beforeEnter: async (): Promise<{ name: string }> => {
      return await checkAuth()
        ? { name: 'chat.index' }
        : { name: 'login' };
    },
  },
];