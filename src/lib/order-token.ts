import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export function createGuestOrderToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashGuestOrderToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function matchesGuestOrderToken(token: string | undefined, storedHash: string): boolean {
  if (!token || !/^[a-f0-9]{64}$/.test(token) || !/^[a-f0-9]{64}$/.test(storedHash)) {
    return false;
  }

  return timingSafeEqual(Buffer.from(hashGuestOrderToken(token), 'hex'), Buffer.from(storedHash, 'hex'));
}
