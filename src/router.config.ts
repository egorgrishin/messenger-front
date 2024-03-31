import {createRouter, createWebHistory, Router} from "vue-router";
import base from "./routes/base.ts";
import auth from "./routes/auth.ts";

console.log("Router");

// import {useUserStore} from "./stores/userStore.ts";

// const userStore = useUserStore();
//
// function guestHasAccess(name: string | undefined): boolean {
//   const available: string[] = ['home\', \'login\', \'register'];
//   return name ? available.includes(name) : false;
// }

const router: Router = createRouter({
  history: createWebHistory(),
  routes: [
    ...auth,
    ...base,
  ],
});

// router.beforeEach((to) => {
//   return !userStore.user
//     ? guestHasAccess(to.name?.toString())
//     : true;
// })

export default router;
