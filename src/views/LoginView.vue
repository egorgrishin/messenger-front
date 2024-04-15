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
  <form @submit="onLogin">
    <AppInput v-model:model="nick" type="text" placeholder="Nick" />
    <AppInput v-model:model="password" type="password" placeholder="Password" />
    <button>Войти</button>
  </form>
</template>

<style scoped>

</style>