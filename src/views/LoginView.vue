<script setup lang="ts">
import AppInput from "../components/AppInput.vue";
import { Ref, ref } from "vue";
import AuthService from "../services/AuthService";
import { Router, useRouter } from "vue-router";

const router: Router = useRouter();
const nick: Ref<string> = ref<string>('');
const password: Ref<string> = ref<string>('');

const onLogin = async (event: Event): Promise<void> => {
  event.preventDefault();
  if (await new AuthService().login(nick.value, password.value)) {
    await router.push({ name: 'chat.list' });
  }
}
</script>

<template>
  <div class="auth__block">
    <span class="auth__title">Вход в аккаунт</span>
    <form class="auth__form" @submit="onLogin">
      <AppInput v-model:model="nick" type="text" placeholder="Логин" autocomplete />
      <AppInput v-model:model="password" type="password" placeholder="Пароль" autocomplete />
      <button>Войти</button>
    </form>
    <RouterLink :to="{ name: 'register' }" class="auth__register-link">
      <button>Создать аккаунт</button>
    </RouterLink>
  </div>
</template>

<style scoped>

</style>