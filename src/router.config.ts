import { createRouter, createWebHistory, RouteLocationNormalized, Router } from "vue-router";
import auth from "routes/auth";
import base from "routes/base";
import chat from "routes/chat";
import user from "routes/user";
import { checkAuth } from "services/authService.ts";

const router: Router = createRouter({
  history: createWebHistory(),
  routes: [
    ...auth,
    ...base,
    ...chat,
    ...user,
  ],
});

router.beforeEach(async (
  to: RouteLocationNormalized,
): Promise<boolean | object> => {
  const name: string | undefined = to.name?.toString();
  if (!name) {
    return false;
  }
  const isLogged: boolean = await checkAuth();
  return name === 'home' || isLogged !== ['login', 'register'].includes(name)
    ? true
    : { name: 'home' };
});

export default router;
