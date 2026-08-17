import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ORCHESTRATOR_GROK_BOT_ID,
  ORCHESTRATOR_PROMPT,
  SPECIALIST_ADDENDUM,
  SPECIALIST_BOTS,
} from "@/lib/os/grok-bot-prompts";

function copy(label: string, text: string) {
  void navigator.clipboard.writeText(text).then(
    () => toast.success(`${label} copied`),
    () => toast.error("Could not copy"),
  );
}

export function PromptsView() {
  return (
    <div className="grid gap-6">
      <section>
        <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Grok Bot · paste these</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight md:text-4xl">
          Orchestrator instruction. One copy. Paste it.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Open Arcly Orchestrator in Grok Bot. Replace Instructions with the
          block below. Leave any original ownership blurb above it. Then
          paste the specialist addendum into the other eight, or let
          Orchestrator fan it.
        </p>
        <p className="mt-2 font-mono text-xs text-faint">id {ORCHESTRATOR_GROK_BOT_ID}</p>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge>1 · Orchestrator</Badge>
            <p className="text-sm">Full instruction</p>
          </div>
          <Button onClick={() => copy("Orchestrator prompt", ORCHESTRATOR_PROMPT)}>
            <Copy className="size-4" />
            Copy Orchestrator prompt
          </Button>
        </div>
        <pre className="mt-4 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-lg bg-bg p-4 font-mono text-xs leading-relaxed text-muted">
          {ORCHESTRATOR_PROMPT}
        </pre>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge tone="neutral">2 · Eight specialists</Badge>
            <p className="text-sm">Same REPLACE addendum for each</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => copy("Specialist addendum", SPECIALIST_ADDENDUM)}
          >
            <Copy className="size-4" />
            Copy specialist addendum
          </Button>
        </div>
        <ul className="mt-4 grid gap-1.5 text-xs text-faint sm:grid-cols-2">
          {SPECIALIST_BOTS.map((b) => (
            <li key={b.id} className="font-mono">
              {b.name} · {b.id}
            </li>
          ))}
        </ul>
        <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-bg p-4 font-mono text-xs leading-relaxed text-muted">
          {SPECIALIST_ADDENDUM}
        </pre>
      </section>
    </div>
  );
}
