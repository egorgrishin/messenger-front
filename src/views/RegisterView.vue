<script setup lang="ts">
import AppInput from "../components/AppInput.vue";
import { ref } from "vue";
import { create } from "../api/user.ts";

const nick = ref<string>('');
const password = ref<string>('');

const onSubmit = (event: Event) => {
  event.preventDefault();
  console.log(create(nick.value, password.value));
}
</script>

<template>
  <form @submit="onSubmit">
    <AppInput v-model:model="nick" type="text" placeholder="Nick" />
    <AppInput v-model:model="password" type="password" placeholder="Password" />
    <button>Register</button>
  </form>
</template>

<style scoped>

</style>