<script setup lang="ts">
interface Props {
  bg: string,
  border?: string,
  color?: string,
  fontWeight?: number,
  padding?: string,
  disabled?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  border: (props) => '1px solid ' + props.bg,
  fontWeight: 500,
  padding: '0.6em 1.2em',
});
</script>

<template>
  <button :style="{
    padding: padding,
    border: props.border ?? '1px solid ' + bg,
    background: props.bg,
    color: props.color,
    fontWeight: props.fontWeight,
  }">
    <slot />
  </button>
</template>

<style scoped lang="scss">
button {
  border-radius: 8px;
  font-size: 1em;
  font-family: inherit;
  cursor: pointer;
  transition: 0.1s;
  outline: none;
}

button:hover {
  opacity: 0.95;
}
</style>