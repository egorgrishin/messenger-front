<script setup lang="ts">
import { Router, useRouter } from "vue-router";
import { ref, Ref } from "vue";
import AuthService from "services/AuthService";
import AppSvgPlus from "components/AppSvgPlus.vue";
import AppSvgLogout from "components/AppSvgLogout.vue";

const router: Router = useRouter();

const onLogout = async () => {
  new AuthService().logout();
  await router.push({ name: 'home' });
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
    <div class="logo">
      <RouterLink :to="{ name: 'home' }">
        Messenger
      </RouterLink>
    </div>

    <div class="links" v-if="nick">
      <div class="links__nick">
        {{ nick }}
      </div>
      <div class="links__icon" @click="onSearch">
        <AppSvgPlus fill="#373737" size="1.35rem" />
      </div>
      <div class="links__icon" @click="onLogout">
        <AppSvgLogout fill="#373737" size="1.35rem" />
      </div>
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
  padding: 0 1.5rem;
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
    align-items: center;

    .links__nick {
      border-right: 1px solid #999;
      padding-right: 0.75rem;
    }

    .links__icon {
      cursor: pointer;
    }
  }
}
</style>