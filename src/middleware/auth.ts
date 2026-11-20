import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { getOrCreateUser } from '../db/users.ts';

export interface AuthRequest extends Request {
  user?: { uid: string; email: string; authMethod: 'env-or-bootstrap' };
}

function getCleanSecret(key: string): string {
  const val = (process.env[key] || '').trim();
  if (!val || val === `MY_${key}` || val.startsWith('MY_')) return '';
  return val;
}

function getSessionSecret(): string {
  return (
    getCleanSecret('ADMIN_SESSION_SECRET') ||
    getCleanSecret('ADMIN_PASSWORD') ||
    'jv-wall-care-udyog-admin-secret-2026'
  );
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(`jv_salt:${password}`).digest('hex');
}

export function safeCompareStrings(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export function createAdminSessionToken(email: string, uid = 'admin-bootstrap'): string {
  const exp = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = Buffer.from(JSON.stringify({ uid, email, exp })).toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payload)
    .digest('base64url');
  return `jvadmin.${payload}.${sig}`;
}

export function verifyAdminSessionToken(
  token: string
): { uid: string; email: string; exp: number } | null {
  if (!token.startsWith('jvadmin.')) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [, payload, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payload)
    .digest('base64url');
  if (!safeCompareStrings(sig, expectedSig)) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!decoded.exp || Date.now() > decoded.exp) return null;
    return decoded;
  } catch {
    return null;
  }
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing admin authentication token' });
  }

  const token = authHeader.split('Bearer ')[1].trim();
  const adminSession = verifyAdminSessionToken(token);

  if (!adminSession) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin session token' });
  }

  req.user = {
    uid: adminSession.uid,
    email: adminSession.email,
    authMethod: 'env-or-bootstrap',
  };

  try {
    await getOrCreateUser(adminSession.uid, adminSession.email);
  } catch (err) {
    console.error('Non-fatal user sync warning:', err);
  }

  return next();
};
