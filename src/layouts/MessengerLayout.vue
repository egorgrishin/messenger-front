<script setup lang="ts">
import Sidebar from "components/Sidebar.vue";
import { useScreen } from "composables/screen.ts";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
import Online from "composables/online.ts";

const needShowSidebar = () => !route.query.chatId;

const route = useRoute();
const { isMobile } = useScreen();

const isShowSidebar = ref<boolean>(needShowSidebar());
const isShowMain = ref<boolean>(!isShowSidebar.value);

watch(() => route.query, () => {
  isShowSidebar.value = needShowSidebar();
  isShowMain.value = !isShowSidebar.value;
});

Online.init();
</script>

<template>
  <div class="general">
    <Sidebar v-if="!isMobile || isShowSidebar" />
    <main v-if="!isMobile || isShowMain">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use "assets/vars" as *;

.general {
  display: flex;
  gap: 1.5rem;
  padding: 0.75rem;
  box-sizing: border-box;
  background: #f5f9f8;
  height: 100vh;
}

main {
  flex-grow: 1;
  height: calc(100vh - 1.5rem);
  overflow-x: hidden;
}

.sidebar.sidebar__mobile {
  width: 100%;
}
</style>