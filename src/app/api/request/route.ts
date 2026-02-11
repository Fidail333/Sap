import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.formData();
  if (data.get('consent') !== 'on') return NextResponse.json({ error: 'Требуется согласие' }, { status: 400 });

  const payload = {
    name: String(data.get('name') || ''),
    phone: String(data.get('phone') || ''),
    email: String(data.get('email') || ''),
    company: String(data.get('company') || ''),
    product: String(data.get('product') || ''),
    comment: String(data.get('comment') || '')
  };

  console.log('REQUEST_FORM_PAYLOAD', payload);
  return NextResponse.json({ ok: true, integrations: { smtpReady: Boolean(process.env.SMTP_HOST), telegramReady: Boolean(process.env.TELEGRAM_BOT_TOKEN) } });
}
