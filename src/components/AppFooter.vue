<script setup lang="ts">
const startYear = 2024;
const currentYear = new Date().getFullYear();

const year = currentYear - startYear !== 0
    ? `${startYear}—${currentYear}`
    : currentYear;

const author = 'Гришин Е. А.';
</script>

<template>
  <footer>
    <span>© {{ author }}, {{ year }}</span>
  </footer>
</template>

<style lang="scss" scoped>
@import "../assets/vars";

footer {
  height: $footer-height;
  display: flex;
  width: 100%;
  padding: 1rem;
  justify-content: flex-end;
  box-sizing: border-box;
}
</style>