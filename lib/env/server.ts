import 'server-only';

import { getPublicEnv, type PublicEnv } from '@/lib/env/client';

export function getServerEnv(): PublicEnv {
  return getPublicEnv();
}
