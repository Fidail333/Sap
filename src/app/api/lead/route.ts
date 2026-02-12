import { NextResponse } from 'next/server';

type LeadHistoryItem = {
  role: 'user' | 'bot';
  text: string;
};

type LeadPayload = {
  name?: string;
  phone?: string;
  message?: string;
  pageUrl?: string;
  pageTitle?: string;
  history?: LeadHistoryItem[];
  source?: 'chat-widget';
  consent?: boolean;
  hp?: string;
};

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const rateLimitStore = new Map<string, RateLimitRecord>();

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('8')) {
    return `+7${digits.slice(1)}`;
  }

  if (digits.length === 11 && digits.startsWith('7')) {
    return `+${digits}`;
  }

  return '';
}

function isValidRuPhone(phone: string) {
  return /^\+7\d{10}$/.test(phone);
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
      const author = item.role === 'user' ? 'Клиент' : 'Бот';
      return `• <b>${author}:</b> ${escapeHtml(item.text)}`;
    })
    .join('\n');

  return `\n\n<b>Контекст (последние реплики):</b>\n${historyRows}`;
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as LeadPayload | null;
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (payload.hp && payload.hp.trim()) {
    return NextResponse.json({ ok: false, error: 'spam_detected' }, { status: 400 });
  }

  if (payload.consent !== true) {
    return NextResponse.json({ ok: false, error: 'consent_required' }, { status: 400 });
  }

  const normalizedPhone = normalizePhone(String(payload.phone || ''));
  if (!isValidRuPhone(normalizedPhone)) {
    return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 });
  }

  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json({ ok: false, error: 'too_many_requests' }, { status: 429 });
  }

  const validHistory = Array.isArray(payload.history) ? payload.history.filter(isHistoryItem) : [];
  const userAgent = request.headers.get('user-agent') || '';

  const lines = [
    '<b>🟦 Новая заявка с сайта Sapphire LED</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(payload.name?.trim() || '—')}`,
    `<b>Телефон:</b> ${escapeHtml(normalizedPhone)}`,
    `<b>Сообщение:</b> ${escapeHtml(payload.message?.trim() || '—')}`,
    `<b>Страница:</b> ${escapeHtml(payload.pageTitle?.trim() || '—')} (${escapeHtml(payload.pageUrl?.trim() || '—')})`
  ];

  if (payload.source) {
    lines.push(`<b>Источник:</b> ${escapeHtml(payload.source)}`);
  }

  if (userAgent) {
    lines.push(`<b>User-Agent:</b> ${escapeHtml(userAgent)}`);
  }

  lines.push(formatHistory(validHistory));

  const messageText = lines.filter(Boolean).join('\n');

  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
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
}
