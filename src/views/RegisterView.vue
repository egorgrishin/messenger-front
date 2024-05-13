<script setup lang="ts">
import AppInput from "../components/AppInput.vue";
import { ref } from "vue";
import AuthService from "../services/AuthService";

const nick = ref<string>('');
const password = ref<string>('');

const onRegister = async (event: Event) => {
  event.preventDefault();
  await new AuthService().register(nick.value, password.value);
}
</script>

<template>
  <div class="auth__block">
    <span class="auth__title">Регистрация аккаунта</span>
    <form class="auth__form" @submit="onRegister">
      <AppInput v-model:model="nick" type="text" placeholder="Логин" />
      <AppInput v-model:model="password" type="password" placeholder="Пароль" />
      <button>Регистрация</button>
    </form>
    <RouterLink :to="{ name: 'login' }" class="auth__register-link">
      <button>Войти</button>
    </RouterLink>
  </div>
</template>

<style scoped>

</style>