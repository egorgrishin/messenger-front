import { createRouter, createWebHistory, RouteLocationNormalized, Router } from "vue-router";
import auth from "./routes/auth";
import base from "./routes/base";
import chat from "./routes/chat";
import user from "./routes/user";
import AuthService from "./services/AuthService";

const router: Router = createRouter({
  history: createWebHistory(),
  routes: [
    ...auth,
    ...base,
    ...chat,
    ...user,
  ],
});

router.beforeEach(async (to: RouteLocationNormalized): Promise<boolean> => {
  const name: string | undefined = to.name?.toString();
  if (!name) {
    return false;
  }

  const isLogged: boolean = await new AuthService().checkAuth();
  console.log(isLogged !== ['home', 'login', 'register'].includes(name));
  return isLogged !== ['home', 'login', 'register'].includes(name);
});

export default router;
