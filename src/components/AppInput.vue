<script setup lang="ts">
interface Props {
  type: 'text' | 'password',
  placeholder: string,
  required?: boolean,
  minlength?: number,
  maxlength?: number,
}

const props = withDefaults(defineProps<Props>(), {
  required: true,
});
const model = defineModel('model', {
  required: true,
});
</script>

<template>
  <input
    v-model="model"
    :type="props.type"
    :placeholder="props.placeholder"
    :minlength="props.minlength"
    :maxlength="props.maxlength"
    :required="props.required"
  >
</template>

<style scoped lang="scss">

</style>