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
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5759 2.40213 14.9412 3.06417 16.2246C3.32379 16.7279 3.40711 17.3096 3.24438 17.8521L2.53365 20.2212C2.3048 20.984 3.01602 21.6952 3.77882 21.4664L6.14794 20.7556C6.69036 20.5929 7.27207 20.6762 7.77536 20.9358C9.05879 21.5979 10.4241 22 12 22Z"
      stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    />
    <path
      d="M11.9955 12H12.0045M15.991 12H16M8 12H8.00897" stroke="#141B34" stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped lang="scss">

</style>