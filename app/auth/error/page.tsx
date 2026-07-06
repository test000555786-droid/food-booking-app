import Link from "next/link";

export default function SupabaseAuthErrorPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-text">
      <div className="mx-auto flex max-w-xl flex-col gap-4 rounded-3xl border border-border bg-surface p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-danger">
          Supabase Auth
        </p>
        <h1 className="text-3xl font-bold">Authentication could not be completed</h1>
        <p className="text-sm leading-6 text-text-muted">
          Double-check your Supabase redirect URLs, email template URLs, and local
          environment variables, then try the flow again.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
