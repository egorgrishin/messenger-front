import { ref, Ref } from "vue";

/**
 * Класс уведомления об ошибке
 */
export default class Notify {
  /**
   * Текст уведомления
   */
  static text: Ref<string | null> = ref(null);

  /**
   * Время отображения уведомления в ms
   */
  static get DISPLAY_TIME(): number {
    return 3000;
  }

  /**
   * Устанавливает текст уведомления
   */
  static send: (text: string) => void = (text: string): void => {
    Notify.text.value = text;
    setTimeout(Notify.clear, Notify.DISPLAY_TIME);
  }

  /**
   * Очищает содержимое уведомления
   */
  private static clear: () => void = (): void => {
    Notify.text.value = null;
  }
}