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

### Telegram (чат-виджет и `/api/lead`)
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_ADMIN_CHAT_ID`
- `NEXT_PUBLIC_SITE_URL`

> Токены и chat id храним только в переменных окружения. Не коммитьте значения в код.

### Как создать Telegram-бота
1. Откройте `@BotFather` в Telegram.
2. Выполните `/newbot`.
3. Укажите имя и username бота.
4. Скопируйте выданный токен и сохраните в `TELEGRAM_BOT_TOKEN`.

### Важно: запуск диалога с ботом
Администратор должен открыть вашего бота и отправить ему `/start`, иначе бот не сможет написать первым.

### Как получить `TELEGRAM_ADMIN_CHAT_ID`
1. Напишите в Telegram боту `@userinfobot`.
2. Возьмите поле `Id` из ответа.
3. Сохраните это значение в `TELEGRAM_ADMIN_CHAT_ID`.

### Добавление env в Vercel
1. Откройте проект в Vercel → **Settings** → **Environment Variables**.
2. Добавьте `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`, `NEXT_PUBLIC_SITE_URL`.
3. Выберите окружения (Production/Preview/Development).
4. Перезапустите деплой.

### Проверка отправки заявки
1. Локально запустите `npm run dev`.
2. Откройте сайт, вызовите чат, оставьте заявку с телефоном и согласием.
3. Убедитесь, что сообщение пришло в Telegram администратору.
4. При частых отправках с одного IP (больше 3 за 10 минут) endpoint `/api/lead` вернёт `429`.

### SMTP
- `ENABLE_SMTP=true`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `REQUEST_TO_EMAIL`, `REQUEST_FROM_EMAIL`

### Telegram (legacy `/api/request`)
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
