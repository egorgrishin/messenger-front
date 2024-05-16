const LoginView = () => import('views/LoginView.vue')
const RegisterView = () => import('views/RegisterView.vue')

export default [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  }
]