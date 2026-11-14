import 'server-only';

import {
  createHash,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';

/*
 * New Hadiyad share links use 72 bits of
 * cryptographically secure randomness.
 *
 * 9 random bytes encoded with base64url produce
 * approximately 12 URL-safe characters.
 *
 * Example:
 * https://www.hadiyadpay.com/h/A7kP3mQ9xT2n
 *
 * Older, longer Hadiyad links remain valid because
 * validation accepts tokens up to 256 characters.
 */
const SHARE_TOKEN_BYTES = 9;

const MIN_SHARE_TOKEN_LENGTH = 12;
const MAX_SHARE_TOKEN_LENGTH = 256;

export function createShareToken(): string {
  return randomBytes(
    SHARE_TOKEN_BYTES,
  ).toString('base64url');
}

export function hashShareToken(
  token: string,
): string {
  return createHash('sha256')
    .update(
      token,
      'utf8',
    )
    .digest('hex');
}

export function isValidShareTokenFormat(
  token: string,
): boolean {
  return (
    typeof token === 'string' &&
    token.length >=
      MIN_SHARE_TOKEN_LENGTH &&
    token.length <=
      MAX_SHARE_TOKEN_LENGTH &&
    /^[A-Za-z0-9_-]+$/.test(
      token,
    )
  );
}

export function matchesShareToken(
  token: string,
  expectedHash: string,
): boolean {
  if (
    !isValidShareTokenFormat(
      token,
    )
  ) {
    return false;
  }

  if (
    !/^[0-9a-f]{64}$/i.test(
      expectedHash,
    )
  ) {
    return false;
  }

  const actualHash =
    hashShareToken(token);

  const actualBuffer =
    Buffer.from(
      actualHash,
      'hex',
    );

  const expectedBuffer =
    Buffer.from(
      expectedHash,
      'hex',
    );

  if (
    actualBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    actualBuffer,
    expectedBuffer,
  );
}