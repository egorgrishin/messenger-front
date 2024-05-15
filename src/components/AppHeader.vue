<script setup lang="ts">
import { Router, useRouter } from "vue-router";
import { ref, Ref } from "vue";
import AuthService from "services/AuthService";
import AppSvgPlus from "components/AppSvgPlus.vue";
import AppSvgLogout from "components/AppSvgLogout.vue";

const router: Router = useRouter();

const onLogout = async () => {
  new AuthService().logout();
  await router.push({ name: 'login' });
}

const onSearch = async () => {
  await router.push({ name: 'user.search' });
}

const nick: Ref<string | null> = ref(localStorage.getItem('userNick'));
window.addEventListener('auth', (event: any) => {
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
@import "../assets/vars";
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap');

header {
  height: $header-height;
  display: flex;
  justify-content: space-between;
  padding: 0 1.5rem;
  box-sizing: border-box;
  background: #fff;
  align-items: center;
}

.logo {
  color: #212121;
  font: bold 1.1rem 'Raleway', sans-serif;
}

.menu {
  align-items: center;
  display: flex;
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