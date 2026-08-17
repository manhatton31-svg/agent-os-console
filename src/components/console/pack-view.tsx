import { toast } from "sonner";
import { Check, Copy, RotateCcw, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AGENT_OS_PACK,
  PACK_CANONICAL,
  PACK_CYCLE,
  PACK_LOAD_ORDER,
  PACK_RULES,
  PACK_SKILLS,
  PACK_VERSION,
  PACK_CONSUMERS,
  routingMatchesPack,
} from "@/lib/os/pack";
import { useOs } from "@/lib/os/store";

const FETCH_SNIPPET = `If this is an Agent OS / Helix / Arcly / DealForge / LivingGoals build:
1. Fetch ${PACK_CANONICAL.rawCatalog}
2. Fetch ${PACK_CANONICAL.rawBoot}
3. Apply catalog.defaults before writing product code.
4. Copy .grok/skills/{${PACK_SKILLS.join(",")}} into the workspace.
Do not invent a parallel Agent OS.`;

export function PackView() {
  const routing = useOs((s) => s.routing);
  const spec = useOs((s) => s.spec);
  const applyPack = useOs((s) => s.applyPack);
  const inForce = routingMatchesPack(routing);
  const missing = PACK_SKILLS.filter((s) => s !== "agent-os" && !spec.skills.includes(s));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={inForce ? "ok" : "warn"}>{inForce ? "In force" : "Drift"}</Badge>
          <Badge>{PACK_VERSION}</Badge>
          <Badge tone="neutral">{PACK_CYCLE}</Badge>
        </div>
        <h1 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
          Later builds inherit this pack.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Catalog defaults drive routing, teammate lanes, and required skills.
          Monday / Wednesday / Friday scans fetch this catalog first and skip
          anything already in force. New workspaces fetch the public boot
          contract. Arcly v2 is a required consumer — it pull-syncs this
          catalog hourly, and on every pack push.
        </p>

        <ol className="mt-6 grid gap-2">
          {PACK_LOAD_ORDER.map((item, i) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5"
            >
              <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-sm">{item}</span>
              {i < 3 ? (
                <Badge tone="accent" className="ml-auto">
                  required
                </Badge>
              ) : (
                <span className="ml-auto text-xs text-faint">on demand</span>
              )}
            </li>
          ))}
        </ol>

        <ul className="mt-6 grid gap-2">
          {PACK_RULES.map((rule) => (
            <li key={rule} className="flex gap-2 text-sm leading-relaxed text-muted">
              <Check className="mt-0.5 size-4 shrink-0 text-ok" />
              {rule}
            </li>
          ))}
        </ul>
      </section>

      <aside className="grid gap-4">
        <div className="rounded-xl border border-line bg-surface p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-ok" />
            <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Live policy</p>
          </div>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Plan</dt>
              <dd className="font-mono text-xs">
                {routing.planModel} · {routing.planEffort}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Execute</dt>
              <dd className="font-mono text-xs">
                {routing.execModel} · {routing.execEffort}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Compact at</dt>
              <dd className="font-mono text-xs">{(routing.compactAt / 1000).toFixed(0)}k</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Quarantine</dt>
              <dd className="font-mono text-xs">{routing.isolateSubagents ? "on" : "off"}</dd>
            </div>
          </dl>
          {missing.length ? (
            <p className="mt-4 text-xs text-warn">Missing required skills: {missing.join(", ")}</p>
          ) : (
            <p className="mt-4 text-xs text-ok">Required skills present on the spec.</p>
          )}
          <ul className="mt-4 grid gap-1.5 border-t border-line pt-3">
            {PACK_CONSUMERS.map((c) => (
              <li key={c.repo} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted">{c.name}</span>
                <span className="font-mono text-faint">{c.cadence} · required</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => applyPack()} disabled={inForce && missing.length === 0}>
              <RotateCcw className="size-3.5" />
              Reapply pack
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                void navigator.clipboard.writeText(JSON.stringify(AGENT_OS_PACK, null, 2));
                toast.success("Catalog copied");
              }}
            >
              <Copy className="size-3.5" />
              Copy catalog
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-faint">For a later build</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Paste this into the first turn of any new Agent OS session.
          </p>
          <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-bg p-3 font-mono text-xs leading-relaxed text-muted">
            {FETCH_SNIPPET}
          </pre>
          <Button
            size="sm"
            variant="secondary"
            className="mt-3"
            onClick={() => {
              void navigator.clipboard.writeText(FETCH_SNIPPET);
              toast.success("Boot prompt copied");
            }}
          >
            <Copy className="size-3.5" />
            Copy boot prompt
          </Button>
        </div>
      </aside>
    </div>
  );
}
