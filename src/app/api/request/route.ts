import { NextResponse } from 'next/server';
import { createLead } from '@/lib/cms';

export async function POST(request: Request) {
  try {
    const data = await request.formData();

    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const comment = String(data.get('comment') || '').trim();
    const consent = String(data.get('consent') || '');

    if (!name || !email) {
      return NextResponse.json({ ok: false, error: 'name_email_required' }, { status: 400 });
    }

    if (consent !== 'on') {
      return NextResponse.json({ ok: false, error: 'consent_required' }, { status: 400 });
    }

    await createLead({
      name,
      contact: email,
      message: comment || 'Заявка из формы сайта',
      source: 'form'
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed SQL: POST /api/request', error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
