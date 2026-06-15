import { ref, computed } from "vue";

export const MAX_LENGTH = 5000;

export const useForm = () => {
  const text = ref("");
  const isLoading = ref(false);
  const result = ref(null);
  const errorMessage = ref("");

  let controller = null;

  const isOverLimit = computed(() => text.value.length > MAX_LENGTH);

  const submit = async () => {
    controller?.abort();
    controller = new AbortController();
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const response = await fetch("/api/format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.value }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error?.message || "Ошибка сервера, попробуйте позже",
        );
      }

      result.value = (await response.json()).result;
    } catch (error) {
      if (error.name !== "AbortError") errorMessage.value = error.message;
    } finally {
      isLoading.value = false;
    }
  };

  const back = () => {
    controller?.abort();
    result.value = null;
    errorMessage.value = "";
  };

  return { text, isLoading, result, errorMessage, isOverLimit, submit, back };
};
