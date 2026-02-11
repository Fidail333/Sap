import type { Metadata } from 'next';
import { modulesData, sapphireData } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Контакты | SAP LED', 'Контактные данные направлений Sapphire и LED Modules.', '/contacts');

export default function ContactsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-semibold">Контакты</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border p-5">
          <h2 className="text-xl">Sapphire</h2>
          <p className="mt-2 text-sm">{sapphireData.contacts.emails.join(', ')}</p>
          <p className="text-sm">{sapphireData.contacts.phones.join(', ')}</p>
        </article>
        <article className="rounded-xl border p-5">
          <h2 className="text-xl">LED Modules</h2>
          <p className="mt-2 text-sm">{modulesData.contacts.emails.join(', ')}</p>
          <p className="text-sm">{modulesData.contacts.phones.join(', ')}</p>
        </article>
      </div>
    </main>
  );
}
