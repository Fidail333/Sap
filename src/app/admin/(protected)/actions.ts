'use server';

import { revalidatePath } from 'next/cache';
import { createAdminContent, deleteAdminContent, type ContentKind, updateAdminContent, updateLeadStatus } from '@/lib/cms';

function parseContentForm(formData: FormData) {
  return {
    id: String(formData.get('id') || ''),
    kind: String(formData.get('kind') || '') as ContentKind,
    title: String(formData.get('title') || '').trim(),
    slug: String(formData.get('slug') || '').trim(),
    description: String(formData.get('description') || '').trim(),
    content: String(formData.get('content') || '').trim(),
    image: String(formData.get('image') || '').trim(),
    published: String(formData.get('published') || '') === 'on'
  };
}

export async function createContentAction(formData: FormData) {
  const payload = parseContentForm(formData);
  await createAdminContent(payload.kind, payload);
  revalidatePath('/blog');
  revalidatePath('/catalog');
  revalidatePath('/admin');
}

export async function updateContentAction(formData: FormData) {
  const payload = parseContentForm(formData);
  if (!payload.id) return;
  await updateAdminContent(payload.kind, payload.id, payload);
  revalidatePath('/blog');
  revalidatePath('/catalog');
  revalidatePath('/admin');
}

export async function deleteContentAction(formData: FormData) {
  const id = String(formData.get('id') || '');
  const kind = String(formData.get('kind') || '') as ContentKind;
  if (!id) return;
  await deleteAdminContent(kind, id);
  revalidatePath('/blog');
  revalidatePath('/catalog');
  revalidatePath('/admin');
}

export async function updateLeadStatusAction(formData: FormData) {
  const id = String(formData.get('id') || '');
  const status = String(formData.get('status') || 'new') as 'new' | 'in_progress' | 'done';
  if (!id) return;
  await updateLeadStatus(id, status);
  revalidatePath('/admin');
}
