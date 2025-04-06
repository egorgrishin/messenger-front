import { useLoading } from "composables/loading.ts";
import auth from "routes/auth";
import base from "routes/base";
import { checkAuth } from "services/authService.ts";
import { createRouter, createWebHistory, RouteLocationNormalized, Router } from "vue-router";

const { unique } = useLoading();
const router: Router = createRouter({
  history: createWebHistory(),
  routes: [
    ...auth,
    ...base,
  ],
});

router.beforeEach(async (
  to: RouteLocationNormalized,
): Promise<boolean | object> => {
  return unique(async (): Promise<boolean | object> => {
    const name: string | undefined = to.name?.toString();
    if (!name) {
      return false;
    }

    if (name === 'home') {
      return true;
    }

    const isLogged: boolean = await checkAuth();
    return isLogged !== ['login', 'register', 'reset'].includes(name)
      ? true
      : { name: 'home' };
  }, false);
});

export default router;
