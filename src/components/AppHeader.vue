<script setup lang="ts">
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from "vue-router";
import { ref, Ref } from "vue";
import AuthService from "../services/AuthService.ts";

const route: RouteLocationNormalizedLoaded = useRoute();
const router: Router = useRouter();

const onLogout = async () => {
  new AuthService().logout();
  await router.push({ name: 'home' });
}

const nick: Ref<string | null> = ref(localStorage.getItem('userNick'));
window.addEventListener('auth', (event: any) => {
  nick.value = event.detail.nick;
});
</script>

<template>
  <header>
    <div class="logo">
      <RouterLink :to="{ name: 'home' }">
        СМС'ка {{ route.fullPath }}
      </RouterLink>
    </div>

    <div class="links" v-if="!nick">
      <RouterLink :to="{ name:'login' }">
        Вход
      </RouterLink>
      <RouterLink :to="{ name: 'register' }">
        Регистрация
      </RouterLink>
    </div>
    <div v-else>
      {{ nick }}
      <span @click="onLogout">
        Выход
      </span>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import "../assets/vars";
@import url('https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap');

header {
  height: $header-height;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  box-sizing: border-box;
  background: #333;

  .logo a {
    font-family: 'Raleway', sans-serif;
    font-weight: bold;
    font-style: italic;
    color: #eee;
  }

  .links {
    display: flex;
    gap: 0.75rem;

    a {
      color: #eee;
    }
  }
}
</style>