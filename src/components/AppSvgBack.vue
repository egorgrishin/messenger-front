<script setup lang="ts">
const props = defineProps<{
  fill?: string,
  size?: string,
}>();
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    class="bi bi-arrow-left-short"
    viewBox="0 0 16 16"
    :fill="props.fill ? props.fill : 'currentColor'"
    :style="{
      height: size,
      width: size,
      display: 'block',
    }"
  >
    <path fill-rule="evenodd" d="M16 8a1 1 0 0 1-1 1H3.415l4.294 4.292a1.001 1.001 0 0 1-1.416 1.416l-6-6a1 1 0 0 1 0-1.415l6-6A1.001 1.001 0 0 1 7.71 2.71L3.415 7.001H15a1 1 0 0 1 1 1Z" />
  </svg>

</template>

<style scoped lang="scss">

</style>