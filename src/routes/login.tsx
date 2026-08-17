import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <section className="mx-auto grid max-w-md gap-5 rounded-xl border border-line bg-surface p-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Account</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Sign in to persist</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The console works without an account. Sign in to write teammates and
          AGENTS.md drafts back to your workspace.
        </p>
      </div>
      {authEnabled ? (
        <div className="grid gap-2">
          {GROK_PROVIDERS.map((p) => (
            <Button
              key={p.providerId}
              variant="secondary"
              onClick={() => signIn(p.providerId, { callbackURL: "/" })}
            >
              Continue with {p.label}
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">Sign-in is disabled.</p>
      )}
      <Link to="/" className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
        Back to the console
      </Link>
    </section>
  );
}
