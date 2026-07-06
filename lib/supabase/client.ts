import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseCredentials } from "./shared";

export function createClient() {
  const { key, url } = getSupabaseCredentials();

  // Reuse this client in Client Components for auth, realtime, and storage.
  return createBrowserClient(url, key);
}
