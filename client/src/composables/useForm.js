import { ref, computed } from "vue";

export const MAX_LENGTH = 5000;

export const useForm = () => {
  const text = ref("");
  const isLoading = ref(false);
  const sources = ref(null);
  const errorMessage = ref("");

  const isOverLimit = computed(() => text.value.length > MAX_LENGTH);

  const submit = async () => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const response = await fetch("/api/format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.value }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error?.message || "Ошибка сервера, попробуйте позже",
        );
      }

      const data = await response.json();
      sources.value = data.sources;
    } catch (error) {
      errorMessage.value = error.message;
    } finally {
      isLoading.value = false;
    }
  };

  const back = () => {
    sources.value = null;
    errorMessage.value = "";
  };

  return { text, isLoading, sources, errorMessage, isOverLimit, submit, back };
};
