<script setup lang="ts">
import AppButton from "components/AppButton.vue";
import AppInput from "components/AppInput.vue";
import { createUser, sendEmailCode } from "services/userService.ts";
import { ref } from "vue";
import { login } from "services/authService.ts";
import { useRouter } from "vue-router";
import { useLoading } from "composables/loading.ts";

const { unique } = useLoading();
const router = useRouter();
const nick = ref<string>('');
const email = ref<string>('');
const code = ref<string>('');
const password = ref<string>('');
const passwordConfirmation = ref<string>('');

const retry = ref<number>(0);
setInterval(() => retry.value > 0 ? retry.value-- : true, 1000);

const sendCode = async (): Promise<void> => {
  const [retryDelay, passed] = await sendEmailCode(email.value);
  if (typeof retryDelay === 'undefined') {
    return;
  }
  retry.value = Math.max(0, retryDelay - (passed || 0));
}

const onRegister = (event: Event): void => {
  event.preventDefault();

  unique(async (): Promise<void> => {
    if (!await createUser(nick.value, email.value, code.value, password.value, passwordConfirmation.value)) {
      return;
    }
    await login(email.value, password.value)
      ? await router.push({ name: 'app' })
      : await router.push({ name: 'login' });
  }, undefined)
}
</script>

<template>
  <div class="auth__block">
    <span class="auth__title">Регистрация</span>

    <form class="auth__form" @submit="onRegister">
      <AppInput
        v-model:model="nick"
        type="text"
        placeholder="Имя"
        :minlength="3"
        :maxlength="32"
      />

      <hr />

      <AppInput
        v-model:model="email"
        type="email"
        placeholder="Адрес электронной почты"
        :maxlength="255"
      />
      <AppInput
        v-model:model="code"
        type="text"
        placeholder="Код подтверждения"
      />
      <AppButton
        bg="#fff"
        border="1px solid #e8e9ed"
        color="#212121"
        @click="sendCode"
        type="button"
        :disabled="retry > 0 || !email"
      >
        <span v-if="retry > 0">Отправить через {{ retry }}</span>
        <span v-else>Отправить код</span>
      </AppButton>

      <hr />

      <AppInput
        v-model:model="password"
        type="password"
        placeholder="Пароль"
      />
      <AppInput
        v-model:model="passwordConfirmation"
        type="password"
        placeholder="Повторите пароль"
      />

      <AppButton
        bg="#7663fd"
        border="1px solid #7663fd"
        color="#fff"
        :fontWeight="600"
        :disabled="!nick || !email || !code || !password || !passwordConfirmation"
      >
        Регистрация
      </AppButton>
    </form>

    <RouterLink :to="{ name: 'login' }" class="auth__register-link">
      <AppButton
        bg="#fff"
        border="1px solid #e8e9ed"
        color="#212121"
      >
        Войти
      </AppButton>
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
@use "assets/auth" as *;

hr {
  margin: 0.25rem 0;
  border: none;
  height: 1px;
  color: #e8e9ed;
  background-color: #e8e9ed;
  flex-shrink: 0;
}
</style>