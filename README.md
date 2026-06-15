# Форматтер библиографии

Приложение, которое приводит пользовательский список
библиографических ссылок к стандартам оформления Высшей аттестационной
комиссии Республики Беларусь с помощью LLM.

## Возможности

- Ввод списка литературы в свободной форме (до 5000 символов).
- Форматирование по правилам из `server/rules.txt` через LLM.
- Структурированный JSON-ответ от модели: для каждого источника возвращается
  `type` (тип источника), `corrected` (форматированный источник. Недостающие поля помечаются плейсхолдером вида `Поле?`) и `missing_parts` (список недостающих полей).
- Копирование результата в буфер обмена.

## Стек

- **Backend**: Node.js ≥ 20, Express 4, OpenRouter API.
- **Frontend**: Vue 3, Vite 5.

## Структура

```
vak-formatter/
├── Dockerfile
├── .dockerignore
├── .gitignore
├── server/                   # Node.js + Express
│   ├── rules.txt             # правила оформления
│   ├── src/
│   │   ├── config.js         # переменные окружения
│   │   ├── openrouter.js     # HTTP-клиент OpenRouter
│   │   ├── prompt.js         # шаблон системного промпта
│   │   ├── validate.js       # валидация входного текста
│   │   └── index.js          # точка входа
│   ├── .env.example
│   └── package.json
├── client/                   # Vue 3 + Vite
│   ├── src/
│   │   ├── components/       # Header, FormView, ResultView
│   │   ├── composables/      # useForm, useCopy
│   │   ├── styles/           # main.css (дизайн-токены, тёмная тема)
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Запуск

### 1. Backend

```bash
cd server
cp .env.example .env
# в .env укажите OPENROUTER_API_KEY
# положите текст правил в ./rules.txt
npm install
npm run dev
```

Сервер: <http://localhost:3001>.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Клиент: <http://localhost:5173>.

### 3. Docker (production-сборка)

```bash
docker build -t vak-formatter .
docker run -p 8080:8080 \
  -e OPENROUTER_API_KEY=sk-or-v1-... \
  -e OPENROUTER_MODEL=... \
  vak-formatter
```

Приложение доступно на <http://localhost:8080>.

## API

### `POST /api/format`

**Тело запроса:**

```json
{ "text": "1. Иванов И.И. Книга. — М.: Наука, 2020." }
```

**Ответ 200:**

```json
{
  "sources": [
    {
      "type": "Издания с одним, двумя и тремя авторами",
      "corrected": "Иванов, И. И. Книга / И. И. Иванов. – М. : Наука, 2020. – 320 с.",
      "missing_parts": []
    },
    {
      "type": "Электронный ресурс удаленного доступа",
      "corrected": "Петров, П. П. Цифровая эпоха / П. П. Петров. – Издательство?, Год издания?. – URL: … (дата обращения: …).",
      "missing_parts": ["Издательство", "Год издания"]
    }
  ]
}
```
