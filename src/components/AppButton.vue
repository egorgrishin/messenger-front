<script setup lang="ts">
interface Props {
  bg: string,
  border?: string,
  color?: string,
  fontWeight?: number,
}

const props = withDefaults(defineProps<Props>(), {
  border: (props) => '1px solid ' + props.bg,
  fontWeight: 500,
});
</script>

<template>
  <button :style="{
    background: props.bg,
    border: props.border ?? '1px solid ' + bg,
    color: props.color,
    fontWeight: props.fontWeight,
  }">
    <slot />
  </button>
</template>

<style scoped lang="scss">
button {
  border-radius: 8px;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: 0.1s;
}
button:hover {
  opacity: 0.95;
}
</style>