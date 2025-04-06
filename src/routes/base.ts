import { checkAuth } from "services/authService.ts";

const MessengerChatView = () => import('views/MessengerChatView.vue');

// noinspection JSUnusedGlobalSymbols
export default [
  {
    path: '/',
    name: 'home',
    component: {},
    beforeEnter: async (): Promise<{ name: string }> => {
      return await checkAuth()
        ? { name: 'app' }
        : { name: 'login' };
    },
  },
  {
    path: '/app',
    name: 'app',
    component: MessengerChatView,
    meta: { layout: 'messenger' },
  }
];