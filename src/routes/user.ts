const SearchUserView = () => import('views/SearchUserView.vue');

export default [
  {
    path: '/users',
    name: 'user.index',
    component: SearchUserView,
  },
];