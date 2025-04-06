<script setup lang="ts">
interface Props {
  bg: string,
  border?: string,
  borderRadius?: string,
  color?: string,
  fontWeight?: number,
  padding?: string,
  disabled?: boolean,
  type?: "button" | "submit" | "reset" | undefined,
}

const props = withDefaults(defineProps<Props>(), {
  border: (props) => '1px solid ' + props.bg,
  fontWeight: 500,
  padding: '0.6em 1.2em',
  disabled: false,
});
</script>

<template>
  <button :style="{
    padding: padding,
    border: props.border ?? '1px solid ' + bg,
    borderRadius: props.borderRadius || '0.5rem',
    background: props.bg,
    color: props.color,
    fontWeight: props.fontWeight,
    cursor: disabled ? undefined : 'pointer'
  }" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<style scoped lang="scss">
button {
  font-size: 1em;
  font-family: inherit;
  transition: 0.1s;
  outline: none;
}

button:hover {
  opacity: 0.95;
}
</style>