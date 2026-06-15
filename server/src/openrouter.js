import { config } from "./config.js";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export const openRouterComplete = async ({
  systemPrompt,
  userInput,
  signal,
}) => {
  const timeoutSignal = AbortSignal.timeout(config.openrouterTimeoutMs);
  const combinedSignal = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal;

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openrouterApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.openrouterModel,
      temperature: config.openrouterTemperature,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "sources",
          strict: true,
          schema: {
            type: "object",
            description: "Отредактированные библиографические источники.",
            properties: {
              sources: {
                type: "array",
                description: "Список источников в исходном порядке.",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      description:
                        "Название типа источника из заголовков правил (например: 'Издания с одним, двумя и тремя авторами').",
                    },
                    corrected: {
                      type: "string",
                      description:
                        "Источник, отформатированный по правилам. При нехватке данных подставлять плейсхолдеры 'Издательство?', 'Год издания?' и т.п.",
                    },
                    missing_parts: {
                      type: "array",
                      items: { type: "string" },
                      description:
                        "Список названий недостающих полей. Если всё указано — пустой массив [].",
                    },
                  },
                  required: ["type", "corrected", "missing_parts"],
                  additionalProperties: false,
                },
              },
            },
            required: ["sources"],
            additionalProperties: false,
          },
        },
      },
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
};
