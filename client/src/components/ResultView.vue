<script setup>
import { computed } from "vue";
import {
  TAG_TYPES,
  parseTags,
  countTags,
} from "../utils/highlightTags.js";
import { useCopy } from "../composables/useCopy.js";

const props = defineProps({
  result: { type: String, required: true },
});

defineEmits(["back"]);

const lines = computed(() =>
  props.result
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => line.replace(/^\d+\.\s*/, ""))
    .map((line) => parseTags(line)),
);

const stats = computed(() => countTags(props.result));

const { isCopied, copy } = useCopy();

const copyResult = () => {
  const text = lines.value
    .map((tokens, i) => `${i + 1}. ${tokens.map((t) => t.content).join("")}`)
    .join("\n");
  copy(text);
};
</script>

<template>
  <section class="result">
    <header class="result__header">
      <div class="result__title-row">
        <h2 class="result__title">Результат</h2>
        <div class="result__meta">
          <div class="result__stats">
            <span class="result__stat result__stat--source">
              ● {{ stats.sourceTypes }} типов
            </span>
            <span class="result__stat result__stat--missing">
              ● {{ stats.missing }} пропусков
            </span>
          </div>
          <button type="button" class="result__back" @click="$emit('back')">
            ← Новый список
          </button>
        </div>
      </div>
    </header>

    <div class="result__body">
      <ol class="result__list">
        <li v-for="(line, idx) in lines" :key="idx" class="result__line">
          <template v-for="(token, tIdx) in line" :key="`${idx}-${tIdx}`">
            <mark
              v-if="token.type === TAG_TYPES.SOURCE"
              class="result__mark result__mark--source-type"
              >{{ token.content }}</mark
            >
            <mark
              v-else-if="token.type === TAG_TYPES.MISSING"
              class="result__mark result__mark--missing-arg"
              >{{ token.content }}</mark
            >
            <span v-else class="result__text">{{ token.content }}</span>
          </template>
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
