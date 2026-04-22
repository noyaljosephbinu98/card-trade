import { resolveMode } from '@/features/theme/useTheme';

describe('resolveMode', () => {
  it('returns system preference when mode is system', () => {
    expect(resolveMode('system', 'dark')).toBe('dark');
    expect(resolveMode('system', 'light')).toBe('light');
    expect(resolveMode('system', null)).toBe('light');
  });

  it('respects explicit mode regardless of system scheme', () => {
    expect(resolveMode('dark', 'light')).toBe('dark');
    expect(resolveMode('light', 'dark')).toBe('light');
  });
});
