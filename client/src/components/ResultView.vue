<script setup>
import { useCopy } from "../composables/useCopy.js";

const props = defineProps({
  sources: { type: Array, required: true },
});

defineEmits(["back"]);

const { isCopied, copy } = useCopy();

const copyResult = () => {
  const text = props.sources
    .map((s, i) => `${i + 1}. ${s.corrected || ""}`)
    .join("\n");
  copy(text);
};
</script>

<template>
  <section class="result">
    <header class="result__header">
      <div class="result__title-row">
        <h2 class="result__title">Результат</h2>
        <button type="button" class="result__back" @click="$emit('back')">
          ← Новый список
        </button>
      </div>
    </header>

    <div class="result__body">
      <ol class="result__list">
        <li v-for="(source, idx) in sources" :key="idx" class="result__item">
          <div class="result__item-head">
            <span class="result__num">{{ idx + 1 }}.</span>
            <mark v-if="source.type" class="result__type">{{
              source.type
            }}</mark>
          </div>
          <p class="result__text">
            <span v-if="source.corrected">{{ source.corrected }}</span>
            <span v-else class="result__empty">—</span>
          </p>
          <ul v-if="source.missing_parts.length" class="result__gaps">
            <li
              v-for="(gap, gIdx) in source.missing_parts"
              :key="gIdx"
              class="result__gap"
            >
              <span class="result__gap-dot" aria-hidden="true">⚠</span>
              {{ gap }}
            </li>
          </ul>
        </li>
      </ol>
    </div>

    <div class="result__copy-row">
      <button
        type="button"
        class="result__copy"
        :class="{ 'result__copy--done': isCopied }"
        @click="copyResult"
        :aria-label="isCopied ? 'Скопировано' : 'Скопировать'"
        :title="isCopied ? 'Скопировано' : 'Скопировать'"
      >
        <svg
          v-if="!isCopied"
          class="result__copy-icon"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        <svg
          v-else
          class="result__copy-icon"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </button>
    </div>
  </section>
</template>
