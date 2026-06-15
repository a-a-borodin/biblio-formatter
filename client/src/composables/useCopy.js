import { ref } from "vue";

const COPY_FEEDBACK_MS = 2000;

export const useCopy = () => {
  const isCopied = ref(false);
  let timer = null;

  const copy = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      isCopied.value = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        isCopied.value = false;
      }, COPY_FEEDBACK_MS);
    } catch {
      /* clipboard недоступен */
    }
  };

  return { isCopied, copy };
};
