<script setup lang="ts">
const props = defineProps<{
  fill?: string,
  size?: string,
}>();
</script>

<template>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      width="100"
      height="100"
      :fill="props.fill ? props.fill : 'currentColor'"
      :style="{
      height: size,
      width: size,
      display: 'block',
    }"
  >
    <path
        d="M 7 2 L 7 48 L 43 48 L 43 14.59375 L 42.71875 14.28125 L 30.71875 2.28125 L 30.40625 2 Z M 9 4 L 29 4 L 29 16 L 41 16 L 41 46 L 9 46 Z M 31 5.4375 L 39.5625 14 L 31 14 Z"></path>
  </svg>
</template>

<style scoped lang="scss">

</style>