import { useEffect, useState } from "react";
import { Play, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/field";
import { useOs } from "@/lib/os/store";
import type { Topology } from "@/lib/os/types";
import { formatTokens } from "@/lib/utils";
import { statusTone } from "./status";

const GOALS = [
  "Ship AGENTS.md maintainer for the Helix repo",
  "Run a skeptic pass on last week's fuel write-back",
  "Compact the long-horizon research loop without losing decisions",
  "Stand up a Grok Bot-style teammate for Linear triage",
];

export function MissionView() {
  const { teammates, mission, context, dispatch, stop, tick, events } = useOs();
  const [goal, setGoal] = useState(GOALS[0]);
  const [topology, setTopology] = useState<Topology>("hierarchical");
  const live = mission?.status === "running" || mission?.status === "verifying";

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => useOs.getState().tick(), 1100);
    return () => window.clearInterval(id);
  }, [live, tick]);

  const rot = context.rotScore;
  const rotTone = rot > 55 ? "bad" : rot > 25 ? "warn" : "ok";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-xl border border-line bg-surface p-5 md:p-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Dispatch</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight md:text-4xl">
          Persistent teammates, one escalation point.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Monday cycle is live. Planner reasons on grok-4.6 xhigh. Implementors
          execute cheap. Skeptic verifies in an isolated thread. You only step
          in when the bus escalates.
        </p>

        <div className="mt-6 grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="goal">Goal</Label>
            <Input
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              list="goals"
            />
            <datalist id="goals">
              {GOALS.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="topo">Topology</Label>
            <Select
              id="topo"
              value={topology}
              onChange={(e) => setTopology(e.target.value as Topology)}
            >
              <option value="hierarchical">Hierarchical (planner → workers)</option>
              <option value="event-bus">Event bus (subscribe / publish)</option>
              <option value="sequential">Sequential handoff</option>
              <option value="parallel">Parallel fan-out</option>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => dispatch(goal.trim() || GOALS[0], topology)}
              disabled={live || !goal.trim()}
            >
              <Play className="size-4" />
              Run mission
            </Button>
            <Button variant="secondary" onClick={stop} disabled={!live}>
              <Square className="size-4" />
              Halt
            </Button>
          </div>
        </div>

        {mission ? (
          <div className="mt-6 rounded-lg border border-line bg-raised p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">{mission.goal}</p>
              <Badge tone={statusTone(mission.status)}>{mission.status}</Badge>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg">
              <div
                className="h-full bg-accent transition-[width] duration-300"
                style={{ width: `${(mission.step / mission.maxSteps) * 100}%` }}
              />
            </div>
            <p className="mt-2 font-mono text-xs text-muted">
              step {mission.step}/{mission.maxSteps} · verify {mission.verifyPasses} pass /{" "}
              {mission.verifyFails} fail · {mission.topology}
            </p>
          </div>
        ) : null}
      </section>

      <aside className="grid gap-4">
        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Window</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">
            {formatTokens(context.tokens)}
            <span className="text-sm text-faint"> / {formatTokens(context.budget)}</span>
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Badge tone={rotTone}>rot {rot}</Badge>
            <Badge>{context.stage}</Badge>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {context.notes[0] ?? "Idle."}
          </p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Fleet</p>
          <ul className="mt-3 grid gap-2">
            {teammates.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-2 text-sm">
                <span>
                  <span className="text-fg">{m.name}</span>
                  <span className="ml-2 text-faint">{m.role}</span>
                </span>
                <Badge tone={statusTone(m.status)}>{m.status}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Bus</p>
          <ul className="mt-3 grid gap-2">
            {events.slice(0, 5).map((ev) => (
              <li key={ev.id} className="text-sm">
                <span className="text-faint">{ev.source}</span>
                <span className="mx-2 text-line">/</span>
                <span className="text-muted">{ev.payload}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
