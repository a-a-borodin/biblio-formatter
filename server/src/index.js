import express from "express";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { config } from "./config.js";
import { buildSystemPrompt } from "./prompt.js";
import { openRouterComplete } from "./openrouter.js";
import { validateFormatInput } from "./validate.js";

const rules = await fs.readFile(config.rulesFilePath, "utf8");

const app = express();
app.use(express.json({ limit: "64kb" }));

const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));

app.post("/api/format", async (req, res, next) => {
  const abortController = new AbortController();
  res.on("close", () => abortController.abort());

  try {
    const { text } = validateFormatInput(req.body);
    const raw = await openRouterComplete({
      systemPrompt: buildSystemPrompt({ standardRules: rules }),
      userInput: text,
      signal: abortController.signal,
    });
    const data = JSON.parse(raw);
    res.json({ sources: data.sources || [] });
  } catch (err) {
    if (!err.status) err.status = 500;
    next(err);
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.use((_req, res) => {
  res.status(404).json({ error: { message: "Ресурс не найден" } });
});

app.use((err, _req, res, _next) => {
  const status = err.status ?? 500;
  if (status >= 500) console.error("Ошибка:", err);
  res.status(status).json({
    error: {
      message: status < 500 ? err.message : "Ошибка сервера, попробуйте позже",
    },
  });
});

app.listen(config.port);
