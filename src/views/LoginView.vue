<script setup lang="ts">
import AppButton from "components/AppButton.vue";
import AppInput from "components/AppInput.vue";
import { ref } from "vue";
import { login } from "services/authService.ts";
import { useRouter } from "vue-router";
import { useLoading } from "composables/loading.ts";

const { unique } = useLoading();
const router = useRouter();
const email = ref<string>('');
const password = ref<string>('');

const onLogin = (event: Event): void => {
  event.preventDefault();

  // Блокируем параллельное выполнение кода
  unique(async (): Promise<void> => {
    if (await login(email.value, password.value)) {
      await router.push({ name: 'app' });
    }
  }, undefined);
}
</script>

<template>
  <div class="auth__block">
    <span class="auth__title">Вход</span>

    <form class="auth__form" @submit="onLogin">
      <AppInput
        v-model:model="email"
        type="email"
        placeholder="Почта"
        autocomplete
      />
      <AppInput
        v-model:model="password"
        type="password"
        placeholder="Пароль"
        autocomplete
      />
      <AppButton
        bg="#7663fd"
        border="1px solid #7663fd"
        color="#fff"
        :fontWeight="600"
      >
        Войти
      </AppButton>
    </form>

    <RouterLink :to="{ name: 'register' }" class="auth__register-link">
      <AppButton
        bg="#fff"
        border="1px solid #e8e9ed"
        color="#212121"
      >
        Создать аккаунт
      </AppButton>
    </RouterLink>

    <RouterLink :to="{ name: 'reset' }" class="auth__register-link">
      <AppButton
        bg="#fff"
        border="1px solid #e8e9ed"
        color="#212121"
      >
        Восстановить пароль
      </AppButton>
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
@use "assets/auth" as *;
</style>