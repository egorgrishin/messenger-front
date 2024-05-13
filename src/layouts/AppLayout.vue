<script setup lang="ts">
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
</script>

<template>
  <AppHeader />
  <main>
    <slot />
  </main>
  <AppFooter />
</template>

<style lang="scss" scoped>
main {
  position: relative;
  flex-grow: 1;
  padding: 1rem 1.5rem;
}
</style>