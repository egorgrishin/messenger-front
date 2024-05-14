<script setup lang="ts">
import Notify from "../composables/notify";
</script>

<template>
  <Transition>
    <div
      class="notify__block"
      v-if="Notify.text.value"
    >
      <span>{{ Notify.text.value }}</span>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
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

.notify__block {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  max-width: 18rem;
  background: #D0342C;
  padding: 0.5rem 1rem;
  border-radius: 4px;

  span {
    color: #fff;
  }
}
</style>