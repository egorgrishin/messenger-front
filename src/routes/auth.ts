const LoginView = () => import('views/LoginView.vue');
const RegisterView = () => import('views/RegisterView.vue');
const ResetView = () => import('views/ResetView.vue');

export default [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { layout: 'empty' },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { layout: 'empty' },
  },
  {
    path: '/reset',
    name: 'reset',
    component: ResetView,
    meta: { layout: 'empty' },
  }
]