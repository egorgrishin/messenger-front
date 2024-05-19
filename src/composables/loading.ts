import { Ref, ref } from "vue";

export function useLoading(): {
  loading: Ref<boolean>,
  unique: <T, K>(callback: () => T, value: K) => Promise<T | K>,
} {
  const loading = ref<boolean>(false);

  /**
   * Отключает возможность параллеельного выполнения указанного кода
   */
  const unique = async <T, K>(callback: () => T, value: K): Promise<T | K> => {
    if (loading.value) {
      return value;
    }
    loading.value = true;
    const result = await callback();
    loading.value = false;
    return result;
  }

  return {
    loading,
    unique,
  };
}