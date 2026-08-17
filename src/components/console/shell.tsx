import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BookOpen,
  Boxes,
  GitBranch,
  Radio,
  Route as RouteIcon,
} from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Mission", icon: Activity },
  { to: "/teammates", label: "Teammates", icon: Boxes },
  { to: "/spec", label: "AGENTS.md", icon: BookOpen },
  { to: "/context", label: "Context", icon: GitBranch },
  { to: "/routing", label: "Routing", icon: RouteIcon },
  { to: "/events", label: "Events", icon: Radio },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isPending } = useCurrentUserState();

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="min-w-0">
            <p className="font-display text-xl tracking-tight text-fg">Agent OS</p>
            <p className="truncate text-[11px] uppercase tracking-[0.16em] text-faint">
              Monday cycle · live
            </p>
          </Link>
          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="h-8 w-24 animate-pulse rounded-full bg-raised" />
            ) : (
              <>
                <SignedOut>
                  <Link
                    to="/login"
                    className="inline-flex h-11 items-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg"
                  >
                    Sign in
                  </Link>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </>
            )}
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-2">
          {NAV.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "inline-flex h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm",
                  active ? "bg-raised text-fg" : "text-muted hover:text-fg",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 pb-24">{children}</main>
    </div>
  );
}
