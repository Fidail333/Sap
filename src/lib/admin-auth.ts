import crypto from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'sap_admin_session';

function sessionHash(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function isAdminAuthenticated() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token === sessionHash(password);
}

export function setAdminSessionCookie() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  cookies().set(ADMIN_COOKIE, sessionHash(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12
  });

  return true;
}

export function clearAdminSessionCookie() {
  cookies().set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
}
