<script setup lang="ts">
interface Props {
  type: 'text' | 'password' | 'email';
  placeholder: string;
  autocomplete?: boolean;
  required?: boolean;
  minlength?: number;
  maxlength?: number;

  margin?: string;

  id?: string
}

const props = defineProps<Props>();
const model = defineModel<string>('model', {
  required: true,
});
</script>

<template>
  <input
    v-model="model"
    :id="id"
    :type="props.type"
    :placeholder="props.placeholder"
    :minlength="props.minlength"
    :maxlength="props.maxlength"
    :required="props.required"
    :autocomplete="props.autocomplete ? 'on' : 'new-password'"
    :style="{
      margin: margin,
    }"
  >
</template>

<style scoped lang="scss">
input {
  background: #fff;
  font-size: 1rem;
  padding: 0.625rem 1rem;
  border: 1px solid #e8e9ed;
  color: inherit;
  border-radius: 0.5rem;
  outline: none;
  transition: 0.1s;
}

input:hover {
  border: 1px solid #dedee3;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  box-shadow: inset 0 0 0 3rem #fff;
  -webkit-text-fill-color: #212121 !important;
}
</style>