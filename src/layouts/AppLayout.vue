<script setup lang="ts">
import AppHeader from "components/AppHeader.vue";
</script>

<template>
  <AppHeader />
  <main>
    <slot />
  </main>
</template>

<style lang="scss" scoped>
@import "assets/vars";

main {
  position: relative;
  flex-grow: 1;
  padding: 1rem 1.5rem;
  max-height: calc(100% - $header-height - 2rem);
}
</style>