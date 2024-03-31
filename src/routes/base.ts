const HomeView = () => import('../views/HomeView.vue');

export default [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
];