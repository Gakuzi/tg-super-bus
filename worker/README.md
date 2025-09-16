# TG Super-Bus — Worker

Версия API: /api/v1

## Эндпоинты

- POST `/api/v1/rss/pull` — ручной сбор RSS/источников и сохранение идей (KV)
- GET `/api/v1/ideas` — выдача идей с пагинацией по курсору
- POST `/api/v1/ai/improve` — улучшение текста (разбиение по частям)
- POST `/api/v1/tg` — прокси для Telegram Bot API
- GET `/api/v1/redirect/:id` — редирект с трекингом и метрики (`?metrics=1`)

Cron: каждый час, сбор по `RSS_SOURCES` (env, список через запятую)

## Безопасность

HMAC заголовки: `X-Signature`, `X-Nonce`, `X-Timestamp`. Для дев-режима можно пробросить `X-Dev: true` (см. код, ограничено origin).

Провайдер ИИ переопределяется заголовком `X-AI-Provider` (`gemini|cf_ai|openai|heuristic`).

## Примеры cURL

### [WORKER] Ручной сбор RSS
```bash
curl -X POST "$WORKER/api/v1/rss/pull" \
 -H "content-type: application/json" \
 -d '{"topic":"технологии","lang":"ru","timeoutMs":8000,"retries":1}'
```

### [WORKER] Получить идеи
```bash
curl "$WORKER/api/v1/ideas?limit=20"
```

### [WORKER] AI improve
```bash
curl -X POST "$WORKER/api/v1/ai/improve" \
 -H "content-type: application/json" \
 -H "x-signature: $SIG" -H "x-nonce: $NONCE" -H "x-timestamp: $TS" \
 -H "x-ai-provider: gemini" \
 -d '{"variant":"short","text":"Текст поста","brand":{"tone":"дружелюбный","emojis":true,"hashtags":true,"cta":true}}'
```

### [WORKER] Telegram прокси
```bash
curl -X POST "$WORKER/api/v1/tg" \
 -H "content-type: application/json" \
 -H "x-signature: $SIG" -H "x-nonce: $NONCE" -H "x-timestamp: $TS" \
 -d '{"method":"sendMessage","payload":{"chat_id":"@your_channel","text":"Привет!"}}'
```

### [WORKER] Redirect и метрики
```bash
curl "$WORKER/api/v1/redirect/abc123?u=$(python -c 'import urllib.parse;print(urllib.parse.quote("https://example.com"))')"
curl "$WORKER/api/v1/redirect/abc123?metrics=1"
```

## Контракты

- Zod: `worker/shared/contracts/zod.ts`
- OpenAPI: `worker/shared/contracts/openapi.yaml`