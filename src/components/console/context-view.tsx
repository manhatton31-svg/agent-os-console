import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOs } from "@/lib/os/store";
import type { LifecycleStage } from "@/lib/os/types";
import { formatTokens } from "@/lib/utils";

const STAGES: { id: LifecycleStage; title: string; body: string }[] = [
  { id: "admit", title: "Admit", body: "Only project facts, the active goal, and the last tool window enter the window." },
  { id: "place", title: "Place", body: "Put gold facts at the edges. Isolate sub-agent transcripts in their own thread." },
  { id: "compact", title: "Compact", body: "Recency prune (last 5 tool calls) plus a summary beats full history on tool-heavy work." },
  { id: "recover", title: "Recover", body: "Pull from Archivist / fuel when a fact is needed again — do not keep it hot." },
  { id: "reuse", title: "Reuse", body: "Skills and AGENTS.md are reused as pointers, not pasted bodies." },
  { id: "govern", title: "Govern", body: "Cap budget, log rot, require approval before kernel writes." },
];

export function ContextView() {
  const { context, compact, isolate, routing } = useOs();
  const used = Math.min(100, Math.round((context.tokens / context.budget) * 100));
  const rotTone = context.rotScore > 55 ? "bad" : context.rotScore > 25 ? "warn" : "ok";

  return (
    <div className="grid gap-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Lifecycle</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Context is an operating system</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Not one-shot shortening. Admit, place, compact, recover, reuse, govern.
          Compact before {formatTokens(routing.compactAt)} tokens — well before the
          200k price cliff.
        </p>
      </header>

      <section className="rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-3xl tabular-nums">{formatTokens(context.tokens)}</p>
            <p className="text-xs text-faint">of {formatTokens(context.budget)} admitted</p>
          </div>
          <div className="flex gap-2">
            <Badge tone={rotTone}>rot {context.rotScore}</Badge>
            <Badge>{context.stage}</Badge>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-bg">
          <div className="h-full bg-accent" style={{ width: `${used}%` }} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={compact}>Compact now</Button>
          <Button variant="secondary" onClick={isolate}>
            Quarantine skeptic
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STAGES.map((s) => (
          <article
            key={s.id}
            className={`rounded-xl border p-5 ${
              context.stage === s.id ? "border-accent/40 bg-raised" : "border-line bg-surface"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.14em] text-faint">{s.id}</p>
            <h2 className="mt-1 font-display text-2xl">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Notes</p>
        <ul className="mt-3 grid gap-2">
          {context.notes.map((n, i) => (
            <li key={`${n}-${i}`} className="text-sm text-muted">
              {n}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
