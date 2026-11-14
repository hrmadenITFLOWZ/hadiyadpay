import 'server-only';

import {
  createHash,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';

const SHARE_TOKEN_BYTES = 32;

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

export function matchesShareToken(
  token: string,
  expectedHash: string,
): boolean {
  if (
    typeof token !== 'string' ||
    token.length < 32
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