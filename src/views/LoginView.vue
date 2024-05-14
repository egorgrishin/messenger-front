<script setup lang="ts">
import AppInput from "../components/AppInput.vue";
import { Ref, ref } from "vue";
import AuthService from "../services/AuthService";
import { Router, useRouter } from "vue-router";
import AppButton from "components/AppButton.vue";

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
      <AppButton bg="#212121" :fontWeight="600">Войти</AppButton>
    </form>
    <RouterLink :to="{ name: 'register' }" class="auth__register-link">
      <AppButton
        bg="#fff"
        border="1px solid #212121"
        color="#212121"
      >
        Создать аккаунт
      </AppButton>
    </RouterLink>
  </div>
</template>

<style scoped>

</style>