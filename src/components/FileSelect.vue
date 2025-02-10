<script setup lang="ts">
import { ref } from "vue";

const isOpened = ref<boolean>(false);

window.addEventListener('popup', (): void => {
  isOpened.value = true;
});
</script>

<template>
</template>

<style scoped lang="scss">
.opened {
  display: flex;
}

.closed {
  display: none;
}

.popup-block {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>