<script setup lang="ts">
import AppLayout from "./layouts/AppLayout.vue";
import AppNotify from "./components/AppNotify.vue";
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>

  <AppNotify />
</template>

<style lang="scss">
#app {
  margin: 0;
  color: #212121;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
  width: 100%;
}
</style>
