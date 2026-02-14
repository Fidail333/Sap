import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function parseBool(value?: string) {
  return value === '1' || value === 'true';
}

async function sendToTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });

  if (!response.ok) throw new Error(`Telegram delivery failed with status ${response.status}`);

  return true;
}

async function sendToEmail(subject: string, text: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.REQUEST_TO_EMAIL;
  if (!host || !user || !pass || !to) return false;

  const transport = nodemailer.createTransport({ host, port, auth: { user, pass }, secure: port === 465 });
  await transport.sendMail({ from: process.env.REQUEST_FROM_EMAIL || user, to, subject, text });

  return true;
}

export async function POST(request: Request) {
  const data = await request.formData();
  if (data.get('consent') !== 'on') return NextResponse.json({ error: 'Требуется согласие' }, { status: 400 });

  const payload = {
    name: String(data.get('name') || ''),
    phone: String(data.get('phone') || ''),
    email: String(data.get('email') || ''),
    company: String(data.get('company') || ''),
    direction: String(data.get('direction') || ''),
    need: String(data.get('need') || '')
  };

  const text = `Новая заявка\nИмя: ${payload.name}\nТелефон: ${payload.phone}\nEmail: ${payload.email}\nКомпания: ${payload.company}\nНаправление: ${payload.direction}\nЗапрос: ${payload.need}`;
  const tasks: Promise<boolean>[] = [];

  if (parseBool(process.env.ENABLE_TELEGRAM)) tasks.push(sendToTelegram(text));
  if (parseBool(process.env.ENABLE_SMTP)) tasks.push(sendToEmail(`Заявка ${payload.direction}`, text));

  if (!tasks.length) {
    return NextResponse.json({ error: 'Не настроены каналы доставки' }, { status: 503 });
  }

  const results = await Promise.all(tasks);

  if (!results.some(Boolean)) {
    return NextResponse.json({ error: 'Не удалось отправить заявку: проверьте настройки каналов' }, { status: 503 });
  }

  return NextResponse.json({ ok: true, analytics: { event: 'request_submit' } });
}
