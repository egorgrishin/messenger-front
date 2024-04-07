import { createRouter, createWebHistory, RouteLocationNormalized, Router } from "vue-router";
import base from "./routes/base.ts";
import auth from "./routes/auth.ts";
import chat from "./routes/chat.ts";
import AuthService from "./services/AuthService.ts";

console.log("Router");

const router: Router = createRouter({
  history: createWebHistory(),
  routes: [
    ...auth,
    ...base,
    ...chat,
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
