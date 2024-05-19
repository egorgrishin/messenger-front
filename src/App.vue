<script setup lang="ts">
import AppLayout from "layouts/AppLayout.vue";
import AppNotify from "components/AppNotify.vue";
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>

  <AppNotify />
</template>

<style lang="scss">
#app {
  width: 100%;
  max-width: 560px;
  min-height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #ffffff;
  color: #212121;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.04);
  border: 1px solid #e9e9e9;
}
</style>
