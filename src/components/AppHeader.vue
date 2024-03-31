<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute();
</script>

<template>
  <header>
    <div class="logo">
      <RouterLink :to="{ name: 'home' }">
        СМС'ка {{ route.fullPath }}
      </RouterLink>
    </div>

    <div class="links">
      <RouterLink :to="{ name:'login' }">
        Вход
      </RouterLink>
      <RouterLink :to="{ name: 'register' }">
        Регистрация
      </RouterLink>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap');

header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
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