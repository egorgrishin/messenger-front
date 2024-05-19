<script setup lang="ts">
import AppButton from "components/AppButton.vue";
import AppInput from "components/AppInput.vue";
import { createUser } from "services/userService.ts";
import { ref } from "vue";
import { login } from "services/authService.ts";
import { useRouter } from "vue-router";
import { useLoading } from "composables/loading.ts";

const { unique } = useLoading();
const router = useRouter();
const nick = ref<string>('');
const password = ref<string>('');

/**
 * Регистрация ноового пользователя.
 * В случае успеха сразу происходит авторизация и перенеправление на список чатов
 */
const onRegister = (event: Event): void => {
  event.preventDefault();

  // Блокируем параллельное выполнение кода
  unique(async (): Promise<void> => {
    if (!await createUser(nick.value, password.value)) {
      return;
    }
    await login(nick.value, password.value)
      ? await router.push({ name: 'chat.list' })
      : await router.push({ name: 'login' });
  }, undefined)
}
</script>

<template>
  <div class="auth__block">
    <span class="auth__title">Регистрация аккаунта</span>

    <form class="auth__form" @submit="onRegister">
      <AppInput
        v-model:model="nick"
        type="text"
        placeholder="Логин"
      />
      <AppInput
        v-model:model="password"
        type="password"
        placeholder="Пароль"
      />
      <AppButton bg="#212121" color="#fff" :fontWeight="600">Регистрация</AppButton>
    </form>

    <RouterLink :to="{ name: 'login' }" class="auth__register-link">
      <AppButton
        bg="#fff"
        border="1px solid #212121"
        color="#212121"
      >
        Войти
      </AppButton>
    </RouterLink>
  </div>
</template>

<style scoped>

</style>