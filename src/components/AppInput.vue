<script setup lang="ts">
interface Props {
  type: 'text' | 'password';
  placeholder: string;
  autocomplete?: boolean;
  required?: boolean;
  minlength?: number;
  maxlength?: number;
}

const props = defineProps<Props>();
const model = defineModel<string>('model', {
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
    :autocomplete="props.autocomplete ? 'on' : 'new-password'"
  >
</template>

<style scoped lang="scss">
input {
  background: #fff;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  color: inherit;
  border-radius: 0.5rem;
  outline: none;
  transition: 0.1s;
}

input:hover {
  border: 1px solid #e9e9e9;
}

// Убирает подсветку автоматически заполненных полей браузерами
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  box-shadow: inset 0 0 0 3rem #fff;
  -webkit-text-fill-color: #212121 !important;
}

input:-webkit-autofill::first-line {
  font-size: 16px
}
</style>