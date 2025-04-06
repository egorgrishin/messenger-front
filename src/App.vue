<script setup lang="ts">
import MessengerLayout from "layouts/MessengerLayout.vue";
import AppNotify from "components/AppNotify.vue";
import { computed } from "vue";
import EmptyLayout from "./layouts/EmptyLayout.vue";
import { useRoute } from "vue-router";

const layouts = {
  messenger: MessengerLayout,
  empty: EmptyLayout,
}

const route = useRoute();
const layout = computed(() => layouts[route.meta.layout as keyof typeof layouts]);
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>

  <AppNotify />
</template>

<style lang="scss">
@use "@fancyapps/ui/dist/fancybox/fancybox.css" as *;

#app {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  color: #212121;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.04);
}
</style>
