import AuthService from "../services/AuthService.ts";

const HomeView = () => import('../views/HomeView.vue');

export default [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: async () => {
      return await new AuthService().checkAuth()
        ? { name: 'chat' }
        : true;
    },
  },
];