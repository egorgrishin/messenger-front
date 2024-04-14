<script setup lang="ts">
import AppLayout from "./layouts/AppLayout.vue";
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>

<style lang="scss">
#app {
  margin: 0;
  color: #fff;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
  width: 100%;
}
</style>
