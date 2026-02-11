# SAP LED Showcase

Современный сайт-витрина на Next.js, объединяющий контент из:
- https://led-modules.ru/
- https://sapphire-led.com/

## Запуск локально

```bash
npm install
npm run dev
```

## ENV
Скопируйте `.env.example` в `.env.local`.

### SMTP
- `ENABLE_SMTP=true`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `REQUEST_TO_EMAIL`, `REQUEST_FROM_EMAIL`

### Telegram
- `ENABLE_TELEGRAM=true`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Можно включить оба канала сразу.

## Парсер контента

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r scripts/scrape/requirements.txt
python scripts/scrape/scrape.py
```

Результаты:
- JSON: `content/*.json`
- изображения: `public/assets/*`

## Обновление контента
1. Запустить парсер
2. Проверить `content/*.json`
3. Закоммитить изменения

## Docker

```bash
docker compose up --build web
```

Запуск только парсера:

```bash
docker compose run --rm scraper
```
