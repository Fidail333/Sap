import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.formData();

  if (data.get('consent') !== 'on') {
    return NextResponse.json({ error: 'Требуется согласие' }, { status: 400 });
  }

  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  if (!name || !email) {
    return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 });
  }

  const payload = {
    name,
    email,
    comment: String(data.get('comment') || ''),
    productName: String(data.get('productName') || ''),
    productId: String(data.get('productId') || '')
  };

  console.log('REQUEST_FORM_PAYLOAD', payload);
  return NextResponse.json({ ok: true, integrations: { smtpReady: Boolean(process.env.SMTP_HOST), telegramReady: Boolean(process.env.TELEGRAM_BOT_TOKEN) } });
}
