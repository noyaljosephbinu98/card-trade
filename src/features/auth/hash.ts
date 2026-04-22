import { sha256 } from 'js-sha256';

const PEPPER = 'altlite-v1';
const ITERATIONS = 10_000;
// Yield the JS thread every N iterations during async hashing. 500 keeps each
// slice under ~15–20 ms on mid-range devices so React can flush renders and
// native ActivityIndicators keep animating between slices.
const YIELD_EVERY = 500;

export function generateSalt(): string {
  const bytes = new Uint8Array(16);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Synchronous PBKDF-lite. Kept for unit tests and any non-UI call site.
 * Do NOT call from a React event handler — it blocks the JS thread for
 * hundreds of ms on mid-range devices (no spinner animation, no touch).
 * Use {@link hashPasswordAsync} there instead.
 */
export function hashPassword(plain: string, salt: string): string {
  let digest = `${salt}:${PEPPER}:${plain}`;
  for (let i = 0; i < ITERATIONS; i++) {
    digest = sha256(digest);
  }
  return digest;
}

export function verifyPassword(plain: string, salt: string, expectedHash: string): boolean {
  return constantTimeEquals(hashPassword(plain, salt), expectedHash);
}

/**
 * Async variant that yields to the event loop every `YIELD_EVERY` iterations.
 * Produces the exact same digest as {@link hashPassword} (same input, same
 * order, same rounds) so records hashed with either function interoperate.
 * This is the one auth flows should call — register, login, and changePassword
 * all run inside async button handlers where the spinner needs to keep
 * animating and incoming touches need to stay responsive.
 */
export async function hashPasswordAsync(plain: string, salt: string): Promise<string> {
  let digest = `${salt}:${PEPPER}:${plain}`;
  for (let i = 0; i < ITERATIONS; i++) {
    digest = sha256(digest);
    if ((i + 1) % YIELD_EVERY === 0 && i + 1 < ITERATIONS) {
      // eslint-disable-next-line no-await-in-loop
      await yieldToEventLoop();
    }
  }
  return digest;
}

export async function verifyPasswordAsync(
  plain: string,
  salt: string,
  expectedHash: string,
): Promise<boolean> {
  const actual = await hashPasswordAsync(plain, salt);
  return constantTimeEquals(actual, expectedHash);
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function yieldToEventLoop(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
