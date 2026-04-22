import {
  generateSalt,
  hashPassword,
  hashPasswordAsync,
  verifyPassword,
  verifyPasswordAsync,
} from '@/features/auth/hash';

describe('password hashing', () => {
  it('produces deterministic hashes for the same salt', () => {
    const salt = 'deadbeef';
    expect(hashPassword('correct horse', salt)).toEqual(hashPassword('correct horse', salt));
  });

  it('differs when salt differs', () => {
    expect(hashPassword('same', 'salt-a')).not.toEqual(hashPassword('same', 'salt-b'));
  });

  it('verifies the right password', () => {
    const salt = generateSalt();
    const hash = hashPassword('password-123', salt);
    expect(verifyPassword('password-123', salt, hash)).toBe(true);
    expect(verifyPassword('password-124', salt, hash)).toBe(false);
  });

  it('generateSalt returns distinct hex strings', () => {
    const a = generateSalt();
    const b = generateSalt();
    expect(a).toMatch(/^[0-9a-f]+$/);
    expect(a).not.toEqual(b);
  });

  it('async variant matches sync digest (same rounds, same pepper)', async () => {
    const salt = 'deadbeef';
    const sync = hashPassword('correct horse', salt);
    const async_ = await hashPasswordAsync('correct horse', salt);
    expect(async_).toEqual(sync);
  });

  it('verifyPasswordAsync interoperates with hashPassword records', async () => {
    const salt = generateSalt();
    const hash = hashPassword('password-123', salt);
    await expect(verifyPasswordAsync('password-123', salt, hash)).resolves.toBe(true);
    await expect(verifyPasswordAsync('password-124', salt, hash)).resolves.toBe(false);
  });
});
