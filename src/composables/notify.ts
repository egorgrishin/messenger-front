import { ref, Ref } from "vue";

/**
 * Класс уведомления об ошибке
 */
export default class Notify {
  /**
   * Текст уведомления
   */
  static text: Ref<string | null> = ref<string | null>(null);

  /**
   * Цвет уведомления
   */
  static color: Ref<string | null> = ref<string | null>(null);

  static readonly COLOR_RED: string = '#D0342C';
  static readonly COLOR_GREEN: string = '#20AE2C';

  /**
   * Время отображения уведомления в ms
   */
  static readonly DISPLAY_TIME: number = 3000;

  /**
   * Устанавливает текст уведомления
   */
  static send(text: string, color?: string): void {
    Notify.text.value = text;
    Notify.color.value = color || Notify.COLOR_RED;
    setTimeout(Notify.clear, Notify.DISPLAY_TIME);
  }

  /**
   * Отправляет красное уведомление
   */
  static sendRed(text: string): void {
    Notify.send(text, Notify.COLOR_RED);
  }

  /**
   * Отправляет зеленое уведомление
   */
  static sendGreen(text: string): void {
    Notify.send(text, Notify.COLOR_GREEN);
  }

  /**
   * Очищает содержимое уведомления
   */
  private static clear(): void {
    Notify.text.value = null;
    Notify.color.value = null;
  }
}