function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export function getSupabaseCredentials() {
  const url = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");

  // Supabase now prefers publishable keys, but legacy anon keys still work.
  const publishableOrAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!publishableOrAnonKey) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return {
    url,
    key: publishableOrAnonKey,
  };
}

export function getSafeRedirectPath(
  path: string | null | undefined,
  fallback = "/"
): string {
  if (!path || !path.startsWith("/")) {
    return fallback;
  }

  return path;
}
