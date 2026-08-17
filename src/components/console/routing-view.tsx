import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label, Select } from "@/components/ui/field";
import { PACK_DEFAULTS, routingMatchesPack } from "@/lib/os/pack";
import { useOs } from "@/lib/os/store";
import type { Effort } from "@/lib/os/types";
import { formatTokens } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

const MODELS = ["grok-4.6", "grok-4.5", "grok-4.5-fast"];
const EFFORTS: Effort[] = ["low", "medium", "high", "xhigh"];
const THRESHOLDS = [24_000, 48_000, 96_000, 160_000];

export function RoutingView() {
  const { routing, setRouting, teammates, applyPack } = useOs();
  const inForce = routingMatchesPack(routing);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <section>
        <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Policy</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Expensive to plan. Cheap to execute.</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Grok 4.6 with xhigh stays on long trajectories and self-checks.
          Implementors stay on a cheaper model. Compaction is mandatory before
          the doubled-token price band.
        </p>

        <div className="mt-6 grid gap-4">
          <div className="grid gap-1.5">
            <Label>Plan model</Label>
            <Select
              value={routing.planModel}
              onChange={(e) => setRouting({ planModel: e.target.value })}
            >
              {MODELS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Plan effort</Label>
            <Select
              value={routing.planEffort}
              onChange={(e) => setRouting({ planEffort: e.target.value as Effort })}
            >
              {EFFORTS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Execute model</Label>
            <Select
              value={routing.execModel}
              onChange={(e) => setRouting({ execModel: e.target.value })}
            >
              {MODELS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Execute effort</Label>
            <Select
              value={routing.execEffort}
              onChange={(e) => setRouting({ execEffort: e.target.value as Effort })}
            >
              {EFFORTS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Compact at</Label>
            <Select
              value={String(routing.compactAt)}
              onChange={(e) => setRouting({ compactAt: Number(e.target.value) })}
            >
              {THRESHOLDS.map((n) => (
                <option key={n} value={n}>
                  {formatTokens(n)} tokens
                </option>
              ))}
            </Select>
          </div>
          <label className="flex h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={routing.isolateSubagents}
              onChange={(e) => setRouting({ isolateSubagents: e.target.checked })}
              className="size-4 accent-accent"
            />
            Isolate skeptic / worker threads (context quarantine)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={inForce ? "ok" : "warn"}>{inForce ? "Matches pack" : "Drifted from pack"}</Badge>
            <Button size="sm" variant="secondary" onClick={() => applyPack()} disabled={inForce}>
              <RotateCcw className="size-3.5" />
              Restore {PACK_DEFAULTS.planModel} / {PACK_DEFAULTS.execModel}
            </Button>
          </div>
        </div>
      </section>

      <aside className="rounded-xl border border-line bg-surface p-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Live bindings</p>
        <ul className="mt-4 grid gap-3">
          {teammates.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-2 border-b border-line pb-3 last:border-0">
              <div>
                <p className="text-sm">{m.name}</p>
                <p className="font-mono text-xs text-faint">
                  {m.role === "planner" || m.role === "skeptic"
                    ? `${routing.planModel} · ${routing.planEffort}`
                    : `${routing.execModel} · ${routing.execEffort}`}
                </p>
              </div>
              <Badge tone={m.role === "planner" || m.role === "skeptic" ? "warn" : "neutral"}>
                {m.role === "planner" || m.role === "skeptic" ? "plan lane" : "exec lane"}
              </Badge>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
