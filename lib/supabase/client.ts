import { createBrowserClient } from '@supabase/ssr';

import { getPublicEnv } from '@/lib/env/client';
import type { Database } from '@/types/database.generated';

export function createClient() {
  const env = getPublicEnv();
  return createBrowserClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey,
  );
}
