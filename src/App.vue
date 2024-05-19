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
  max-width: 640px;
  min-height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #ffffff;
  color: #212121;
}
</style>
