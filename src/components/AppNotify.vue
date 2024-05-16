<script setup lang="ts">
import Notify from "composables/notify";
</script>

<template>
  <Transition>
    <div class="notify" v-if="Notify.text.value">
      <span class="notify__text">{{ Notify.text.value }}</span>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.notify {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  max-width: 18rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: #D0342C;

  .notify__text {
    color: #fff;
  }
}

// Анимации появления и исчезновения
.v-enter-active {
  transition: 0.3s;
}

.v-leave-active {
  transition: 0.3s;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>