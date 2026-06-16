export const config = {
  port: process.env.PORT,
  openrouterApiKey: process.env.OPENROUTER_API_KEY,
  openrouterModel: process.env.OPENROUTER_MODEL,
  openrouterTemperature: Number(process.env.OPENROUTER_TEMPERATURE ?? 0.1),
  openrouterTimeoutMs: Number(process.env.OPENROUTER_TIMEOUT_MS ?? 120000),
  rulesFilePath: process.env.RULES_FILE_PATH,
};
