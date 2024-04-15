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
  <form @submit="onRegister">
    <AppInput v-model:model="nick" type="text" placeholder="Nick" />
    <AppInput v-model:model="password" type="password" placeholder="Password" />
    <button>Регистрация</button>
  </form>
</template>

<style scoped>

</style>