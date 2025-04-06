<script setup lang="ts">

</script>

<template>
  <header>
    <span class="logo">
      Messenger
    </span>
  </header>

  <main>
    <slot />
  </main>
</template>

<style lang="scss" scoped>
@use "assets/vars" as *;
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap');

main {
  position: relative;
  flex-grow: 1;
  background: #f5f9f8;
  box-shadow: inset 0 0 1rem 0 #e9eeed;
  border-radius: 0.75rem;
  margin: 0 0.75rem 0.75rem;
}

header {
  height: $header-height;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1.5rem;
  box-sizing: border-box;
}

.logo {
  font: bold 1.1rem 'Raleway', sans-serif;
}
</style>