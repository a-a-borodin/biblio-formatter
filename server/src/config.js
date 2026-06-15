import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

export const config = {
  port: process.env.PORT || "8080",
  openrouterApiKey: process.env.OPENROUTER_API_KEY,
  openrouterModel: process.env.OPENROUTER_MODEL,
  openrouterTemperature: Number(process.env.OPENROUTER_TEMPERATURE ?? 0.1),
  openrouterAppTitle: process.env.OPENROUTER_APP_TITLE,
  openrouterTimeoutMs: Number(process.env.OPENROUTER_TIMEOUT_MS ?? 300000),
  rulesFilePath: process.env.RULES_FILE_PATH || "./rules.txt",
  corsOrigin: process.env.CORS_ORIGIN,
};
