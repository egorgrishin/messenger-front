<script setup lang="ts">
const props = defineProps<{
  fill?: string,
  size?: string,
}>();
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    :fill="props.fill ? props.fill : 'currentColor'"
    :style="{
      height: size,
      width: size,
      display: 'block',
    }"
  >
    <path
      d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
      stroke="#212121" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    />
    <path
      d="M15.5 15.5L8.50076 8.5M8.50151 15.5L15.5008 8.5"
      stroke="#212121" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped lang="scss">

</style>