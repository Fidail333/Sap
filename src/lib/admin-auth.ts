import crypto from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'sap_admin_session';

function getAdminSecret() {
  return process.env.ADMIN_TOKEN || process.env.ADMIN_PASSWORD || '';
}

function sessionHash(secret: string) {
  return crypto.createHash('sha256').update(secret).digest('hex');
}

export function isAdminAuthenticated() {
  const secret = getAdminSecret();
  if (!secret) return false;
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token === sessionHash(secret);
}

export function verifyAdminToken(inputToken: string) {
  const secret = getAdminSecret();
  return Boolean(secret && inputToken && inputToken === secret);
}

export function setAdminSessionCookie() {
  const secret = getAdminSecret();
  if (!secret) return false;

  cookies().set(ADMIN_COOKIE, sessionHash(secret), {
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
