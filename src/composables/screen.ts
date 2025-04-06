import { Ref, ref } from "vue";

/**
 * Функция для работы с динамически подгружаемыми списками
 */
export function useScreen(): {
  isMobile: Ref<boolean>,
} {
  const minWidth = 720;
  const isMobile = ref<boolean>(window.innerWidth < minWidth);

  const onResize = (): void => {
    isMobile.value = window.innerWidth < minWidth;
  };
  window.addEventListener('resize', onResize);

  return {
    isMobile,
  };
}
