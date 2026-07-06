import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseCredentials } from "./shared";

export function createClient() {
  const cookieStore = cookies();
  const { key, url } = getSupabaseCredentials();

  // Calling cookies() before Supabase opts authenticated requests out of cache.
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies.
          // Middleware refreshes the session for those requests instead.
        }
      },
    },
  });
}
