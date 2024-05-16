import { Chat, Message } from "../interfaces/chat";
import { nextTick, onMounted, ref, Ref } from "vue";
import { User } from "../interfaces/user";

// Направление прокрутки: вверх или вниз
export enum Direction {
  Up = 0,
  Down = 1,
}

interface Params<T> {
  direction?: Direction,
  itemsGetter: (lastId: number | null) => Promise<T[] | null>,
  lastIdGetter: (items: T[]) => number,
}

interface Return<T> {
  itemsList: Ref<HTMLDivElement | null>,
  items: Ref<T[]>,
  loadItems: (force?: boolean) => Promise<void>,
  setScroll: (prevHeight: number) => void,
  reset: () => void,
}

/**
 * Функция для работы с динамически подгружаемыми списками
 * @param direction Направление прогрутки ссписка
 * @param itemsGetter Функция для получения новых элементов списка
 * @param lastIdGetter Функция для определения ID последнего элемента из списка
 */
export function useList<T = Chat | Message | User>({
  direction = Direction.Down,
  itemsGetter,
  lastIdGetter,
}: Params<T>): Return<T> {
  // Прокрутка вверх (как в сообщениях чата)
  const isUpDirection: boolean = direction === Direction.Up;
  // HTML список элементов
  const itemsList = ref<HTMLDivElement | null>(null);
  // Список элеиментов
  const items: Ref<T[]> = ref([]);
  // ID последнего загруженного элемента
  const lastItemId = ref<number | null>(null);
  // Закончился ли список
  let isEnded: boolean = false;
  // Идет ли загрузка в данный момент
  let inLoad: boolean = false;

  //Вешаем случатель события прокрутки списка
  onMounted(() => {
    itemsList.value?.addEventListener('scroll', scrollList);
  })

  /**
   * Слушатель события прокрутки списка
   * @param event HTML элемент списка
   */
  const scrollList = (event: Event): void => {
    const list: HTMLDivElement = event.target as HTMLDivElement;
    if (
      // Если пролистано 80% списка
      !isUpDirection && list.scrollTop + list.clientHeight >= list.scrollHeight * 0.8
      // Если до конца списка осталось расстояние равное половине высоты блока
      || isUpDirection && list.scrollTop <= list.clientHeight * 0.5
    ) {
      loadItems().then();
    }
  };

  /**
   * Загружает новые элементы и добавляет их в список
   */
  const loadItems = async (): Promise<void> => {
    if (inLoad || isEnded) {
      return;
    }

    inLoad = true;
    const loaded: T[] | null = await itemsGetter(lastItemId.value);
    if (loaded !== null) {
      // Элементов нет, значит список закончен
      if (loaded.length === 0) {
        isEnded = true;
      } else {
        lastItemId.value = lastIdGetter(loaded);
        addItems(loaded)
      }
    }
    inLoad = false;
  }

  /**
   * Добавляет элементы в список.
   * Если прогрутка направлена вверх, то обавляет в начало, иначе - в конец.
   * @param loaded Загруженные элементы
   */
  const addItems = (loaded: T[]): void => {
    if (!isUpDirection) {
      items.value.push(...loaded);
      return;
    }

    const list: HTMLDivElement = itemsList.value as HTMLDivElement;
    const prevHeight: number = list.scrollHeight;
    items.value.unshift(...loaded);
    nextTick().then(() => setScroll(prevHeight));
  }

  /**
   * Устанавливает положение прокрутки списка
   * @param prevHeight Высота блока до изменения его размеров
   */
  const setScroll = (prevHeight: number): void => {
    if (!isUpDirection) {
      return;
    }
    const list: HTMLDivElement = itemsList.value as HTMLDivElement;
    list.scroll({ top: list.scrollHeight - prevHeight });
  }

  /**
   * Сбрасывает сотояние списка
   */
  const reset = (): void => {
    items.value = [];
    lastItemId.value = null;
    isEnded = false;
    inLoad = false;
  }

  return {
    itemsList,
    items,
    loadItems,
    setScroll,
    reset,
  }
}