<script setup lang="ts">
import AppButton from "components/AppButton.vue";
import AppInput from "components/AppInput.vue";
import { createUser } from "services/UserService.ts";
import { ref } from "vue";

const nick = ref<string>('');
const password = ref<string>('');

const onRegister = async (event: Event): Promise<void> => {
  event.preventDefault();
  await createUser(nick.value, password.value);
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