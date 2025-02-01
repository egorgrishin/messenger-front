<script setup lang="ts">
import AppSvgLogout from "components/AppIconLogout.vue";
import AppSvgPlus from "components/AppIconPlus.vue";
import { logout } from "services/authService.ts";
import { Router, useRouter } from "vue-router";
import { ref } from "vue";

const router: Router = useRouter();
const nick = ref<string | null>(localStorage.getItem('userNick'));

/**
 * Выход из аккаунта
 */
const onLogout = async (): Promise<void> => {
  logout();
  await router.push({ name: 'login' });
}

/**
 * Переход на страницу поиска пользователей
 */
const onSearch = async (): Promise<void> => {
  await router.push({ name: 'user.index' });
}

// Слушатель события авторизации
// Получаем из события ник для отображения в шапке
window.addEventListener('auth', (event: any): void => {
  nick.value = event.detail.nick;
});
</script>

<template>
  <header>
    <RouterLink class="logo" :to="{ name: 'home' }">
      Messenger
    </RouterLink>

    <div class="menu" v-if="nick">
      <div class="menu__nick">
        {{ nick }}
      </div>
      <div class="menu__icon" @click="onSearch">
        <AppSvgPlus fill="#373737" size="1.35rem" />
      </div>
      <div class="menu__icon" @click="onLogout">
        <AppSvgLogout fill="#373737" size="1.35rem" />
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use "assets/vars" as *;
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap');

header {
  height: $header-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  box-sizing: border-box;
  background: #fff;
}

.logo {
  font: bold 1.1rem 'Raleway', sans-serif;
}

.menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &__nick {
    padding-right: 0.75rem;
    border-right: 1px solid #999;
  }

  &__icon {
    cursor: pointer;
  }
}
</style>