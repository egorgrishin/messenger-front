<script setup lang="ts">
import { Router, useRouter } from "vue-router";
import { ref, Ref } from "vue";
import AuthService from "../services/AuthService";

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
        Messenger
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
    <div class="links" v-else>
      {{ nick }}
      <span @click="onLogout">
        Logout
      </span>
      <RouterLink :to="{ name: 'user.search' }">
        Search
      </RouterLink>
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
  padding: 0 1rem;
  box-sizing: border-box;
  background: #ffffff;
  align-items: center;

  a {
    color: #212121;
  }

  .logo a {
    font-family: 'Raleway', sans-serif;
    font-weight: bold;
    font-size: 1.1rem;
  }

  .links {
    display: flex;
    gap: 0.75rem;
  }
}
</style>