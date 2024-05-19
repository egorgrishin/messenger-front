<script setup lang="ts">
import AppButton from "components/AppButton.vue";
import AppInput from "components/AppInput.vue";
import { ref } from "vue";
import { login } from "services/authService.ts";
import { useRouter } from "vue-router";
import { useLoading } from "composables/loading.ts";

const { unique } = useLoading();
const router = useRouter();
const nick = ref<string>('');
const password = ref<string>('');

const onLogin = (event: Event): void => {
  event.preventDefault();

  // Блокируем параллельное выполнение кода
  unique(async (): Promise<void> => {
    if (await login(nick.value, password.value)) {
      await router.push({ name: 'chat.index' });
    }
  }, undefined);
}
</script>

<template>
  <div class="auth__block">
    <span class="auth__title">Вход в аккаунт</span>

    <form class="auth__form" @submit="onLogin">
      <AppInput
        v-model:model="nick"
        type="text"
        placeholder="Логин"
        autocomplete
      />
      <AppInput
        v-model:model="password"
        type="password"
        placeholder="Пароль"
        autocomplete
      />
      <AppButton bg="#212121" color="#fff" :fontWeight="600">Войти</AppButton>
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