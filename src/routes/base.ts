import AuthService from "../services/AuthService";

const HomeView = () => import('../views/HomeView.vue');

export default [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: async (): Promise<{ name: string }> => {
      return await new AuthService().checkAuth()
        ? { name: 'chat.list' }
        : { name: 'login' };
    },
  },
];