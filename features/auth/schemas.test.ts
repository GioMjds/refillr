import { describe, expect, it } from 'vitest';

import { signInSchema } from '@/features/auth/schemas';

describe('signInSchema', () => {
  it('normalizes a valid operational login', () => {
    expect(
      signInSchema.parse({
        email: ' STAFF@EXAMPLE.COM ',
        password: 'password123',
      }),
    ).toEqual({ email: 'staff@example.com', password: 'password123' });
  });

  it('rejects malformed credentials', () => {
    expect(
      signInSchema.safeParse({ email: 'bad', password: 'short' }).success,
    ).toBe(false);
  });
});
