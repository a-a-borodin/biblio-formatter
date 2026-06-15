# Форматтер библиографии

Приложение, которое приводит пользовательский список
библиографических ссылок к стандартам оформления Высшей аттестационной
комиссии Республики Беларусь с помощью LLM.

## Возможности

- Ввод списка литературы в свободной форме (до 5000 символов).
- Форматирование по правилам из `server/rules.txt` через LLM.
- Подсветка типа источника (`<@>…<@/>`) и пропущенных данных (`<?>…<?/>`).
- Копирование результата в буфер обмена.

## Стек

- **Backend**: Node.js ≥ 20, Express 4, OpenRouter API.
- **Frontend**: Vue 3, Vite 5.

## Структура

```
vak-formatter/
├── Dockerfile
├── .dockerignore
├── server/                   # Node.js + Express
│   ├── rules.txt             # правила оформления
│   ├── src/
│   │   ├── config.js         # переменные окружения и лимиты
│   │   ├── openrouter.js     # HTTP-клиент OpenRouter
│   │   ├── prompt.js         # шаблон системного промпта
│   │   ├── validate.js       # валидация входного текста
│   │   └── index.js          # точка входа
│   └── .env.example
├── client/                   # Vue 3 + Vite
│   ├── src/
│   │   ├── components/       # Header, FormView, ResultView
│   │   ├── composables/      # useForm, useCopy
│   │   ├── utils/            # highlightTags (парсинг <@> и <?>)
│   │   ├── styles/           # main.css (дизайн-токены, тёмная тема)
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   └── vite.config.js
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

Клиент: <http://localhost:5173>. Vite проксирует `/api/*` на backend.

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
{ "result": "1. <@>Книга<@/> Иванов И.И. Книга. — М.: Наука, 2020." }
```

## Как это работает

1. Пользователь вставляет список литературы в форму.
2. Backend загружает `rules.txt` один раз при старте и подставляет в системный промпт.
3. OpenRouter возвращает отформатированный список, в котором тип источника обёрнут
   в `<@>…<@/>`, а пропущенные поля — в `<?>…<?/>`.
4. Frontend парсит теги, подсвечивает их, рисует нумерацию, считает статистику.
5. Кнопка «скопировать» отдаёт текст без тегов через `navigator.clipboard`.
