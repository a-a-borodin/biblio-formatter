<script setup>
import { MAX_LENGTH } from "../composables/useForm.js";

defineProps({
  isLoading: { type: Boolean, default: false },
  isOverLimit: { type: Boolean, default: false },
  errorMessage: { type: String, default: "" },
});

const text = defineModel("text", { type: String, required: true });
defineEmits(["submit"]);
</script>

<template>
  <form class="form" @submit.prevent="$emit('submit')">
    <label class="form__label" for="bibliography-input">
      Вставьте сюда ваш список литературы
    </label>

    <textarea
      id="bibliography-input"
      class="form__textarea"
      :class="{ 'form__textarea--error': isOverLimit }"
      v-model="text"
      :disabled="isLoading"
      :maxlength="MAX_LENGTH + 1"
      :placeholder="'Например:\n1. Иванов И.И. Основы программирования. — М.: Наука, 2020. — 320 с.\n2. ...'"
      rows="10"
      autocomplete="off"
      spellcheck="false"
    />

    <div class="form__meta">
      <p v-if="errorMessage" class="form__error" role="alert">
        {{ errorMessage }}
      </p>
      <span v-else class="form__hint">Максимум {{ MAX_LENGTH }} символов</span>

      <span
        class="counter"
        :class="{ 'counter--error': isOverLimit }"
        aria-live="polite"
      >
        {{ text.length }} / {{ MAX_LENGTH }}
      </span>
    </div>

    <button
      type="submit"
      class="form__button"
      :disabled="isLoading || isOverLimit || text.trim().length === 0"
    >
      <span v-if="!isLoading">Оформить список</span>
      <span v-else>Обработка…</span>
    </button>
  </form>
</template>
