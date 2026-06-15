<script setup>
import Header from "./components/Header.vue";
import FormView from "./components/FormView.vue";
import ResultView from "./components/ResultView.vue";
import { useForm } from "./composables/useForm.js";

const { text, result, errorMessage, isOverLimit, isLoading, submit, back } =
  useForm();
</script>

<template>
  <div class="app">
    <main class="app__container">
      <Header />

      <section
        class="app__panel"
        :class="{ 'app__panel--blocked': isLoading }"
        :aria-busy="isLoading"
      >
        <FormView
          v-if="!result || isLoading"
          v-model:text="text"
          :is-loading="isLoading"
          :is-over-limit="isOverLimit"
          :error-message="errorMessage"
          @submit="submit"
        />

        <ResultView v-else :result="result" @back="back" />

        <div
          v-if="isLoading"
          class="app__loader"
          role="status"
          aria-live="polite"
        >
          <div class="spinner" aria-hidden="true"></div>
          <p class="app__loader-text">Идет оформление…</p>
          <p class="app__loader-hint">Это может занять до минуты</p>
        </div>
      </section>
    </main>
  </div>
</template>
