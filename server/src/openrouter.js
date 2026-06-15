import { config } from "./config.js";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export const openRouterComplete = async ({
  systemPrompt,
  userInput,
  signal,
}) => {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    config.openrouterTimeoutMs,
  );
  const combinedSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.openrouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": config.corsOrigin,
        "X-Title": config.openrouterAppTitle,
      },
      body: JSON.stringify({
        model: config.openrouterModel,
        temperature: config.openrouterTemperature,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userInput },
        ],
      }),
      signal: combinedSignal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message =
        body?.error?.message ||
        body?.message ||
        `OpenRouter вернул статус ${response.status}`;
      throw new Error(`Ошибка OpenRouter: ${message}`);
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new Error("Пустой ответ от модели");
    }
    return content;
  } finally {
    clearTimeout(timeout);
  }
};
