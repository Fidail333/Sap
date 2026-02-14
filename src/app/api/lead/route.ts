export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { createLead } from '@/lib/cms';

type LeadHistoryItem = {
  role: 'user' | 'bot';
  text: string;
};

type LeadPayload = {
  source?: 'chat-widget';
  location?: string;
  purpose?: string;
  size?: string;
  timeline?: string;
  contact?: string;
  pageUrl?: string;
  pageTitle?: string;
  history?: LeadHistoryItem[];
};

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, RateLimitRecord>();

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'unknown';
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const existing = rateLimitStore.get(ip);

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false };
  }

  rateLimitStore.set(ip, { ...existing, count: existing.count + 1 });
  return { allowed: true };
}

function isHistoryItem(item: unknown): item is LeadHistoryItem {
  if (!item || typeof item !== 'object') return false;
  const maybeItem = item as Partial<LeadHistoryItem>;
  return (maybeItem.role === 'user' || maybeItem.role === 'bot') && typeof maybeItem.text === 'string';
}

function formatHistory(history: LeadHistoryItem[] | undefined) {
  if (!history?.length) return '';

  const recent = history.slice(-6);
  const historyRows = recent
    .map((item) => {
      const author = item.role === 'user' ? 'Клиент' : 'Алсу';
      return `• <b>${author}:</b> ${escapeHtml(item.text)}`;
    })
    .join('\n');

  return `\n\n<b>💬 Контекст (последние реплики):</b>\n${historyRows}`;
}

export async function POST(request: Request) {
  try {
  const payload = (await request.json().catch(() => null)) as LeadPayload | null;
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const contact = String(payload.contact || '').trim();
  if (!contact) {
    return NextResponse.json({ ok: false, error: 'contact_required' }, { status: 400 });
  }

  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json({ ok: false, error: 'too_many_requests' }, { status: 429 });
  }

  const validHistory = Array.isArray(payload.history) ? payload.history.filter(isHistoryItem) : [];


  const leadMessage = [
    `Установка: ${payload.location?.trim() || '—'}`,
    `Назначение: ${payload.purpose?.trim() || '—'}`,
    `Размер: ${payload.size?.trim() || '—'}`,
    `Сроки: ${payload.timeline?.trim() || '—'}`
  ].join(' | ');

  await createLead({
    name: 'Заявка из чата Алсу',
    contact,
    message: leadMessage,
    source: 'chat'
  });

  const lines = [
    '<b>🟢 Новая заявка с сайта Sapphire LED</b>',
    '',
    `<b>📍 Установка:</b> ${escapeHtml(payload.location?.trim() || '—')}`,
    `<b>🎯 Назначение:</b> ${escapeHtml(payload.purpose?.trim() || '—')}`,
    `<b>📐 Размер:</b> ${escapeHtml(payload.size?.trim() || '—')}`,
    `<b>⏱ Сроки:</b> ${escapeHtml(payload.timeline?.trim() || '—')}`,
    '',
    '<b>📞 Контакт:</b>',
    escapeHtml(contact)
  ];

  if (payload.pageUrl || payload.pageTitle) {
    lines.push('', `<b>Страница:</b> ${escapeHtml(payload.pageTitle?.trim() || '—')} (${escapeHtml(payload.pageUrl?.trim() || '—')})`);
  }

  lines.push(formatHistory(validHistory));

  const messageText = lines.filter(Boolean).join('\n');

  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.error('Telegram env is not configured');
    return NextResponse.json({ ok: false, error: 'telegram_not_configured' }, { status: 500 });
  }

  const telegramResponse = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      parse_mode: 'HTML',
      text: messageText,
      disable_web_page_preview: true
    })
  });

  if (!telegramResponse.ok) {
    const telegramError = await telegramResponse.text().catch(() => 'telegram_error');
    console.error('Telegram API error', {
      status: telegramResponse.status,
      body: telegramError
    });
    return NextResponse.json({ ok: false, error: 'telegram_error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed SQL: POST /api/lead', error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

