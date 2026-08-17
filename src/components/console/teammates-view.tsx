import { useState } from "react";
import { ArrowRightLeft, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/field";
import { useOs } from "@/lib/os/store";
import { currentScan, dutyFor, fleetFor, PACK_VERSION } from "@/lib/os/pack";
import { ROLE_BLURB, ROLE_LABEL, type TeammateRole } from "@/lib/os/types";
import { formatTokens } from "@/lib/utils";
import { statusTone } from "./status";

export function TeammatesView() {
  const { teammates, spawn, retire, handoff, applyPack } = useOs();
  const [name, setName] = useState("");
  const [role, setRole] = useState<TeammateRole>("implementor");
  const [fromId, setFromId] = useState(teammates[0]?.id ?? "");
  const [toId, setToId] = useState(teammates[1]?.id ?? "");
  const today = currentScan();

  return (
    <div className="grid gap-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.16em] text-faint">
          Grok Bot pattern · pack {PACK_VERSION}
        </p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Teammates with their own VMs</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Five bots, isolated compute. Each one now carries the weekly cadence —
          Monday Discover, Wednesday Verify, Friday Close. They message over
          the bus. You stay the escalation point.
        </p>
        {today ? (
          <p className="mt-3 text-sm text-ok">
            Today is {today.day} — {today.role}. Briefs below are for this cycle.
          </p>
        ) : null}
      </header>

      <section className="rounded-xl border border-line bg-surface p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_11rem_auto_auto]">
          <div className="grid gap-1.5">
            <Label htmlFor="nm">Name</Label>
            <Input id="nm" value={name} onChange={(e) => setName(e.target.value)} placeholder="Iris" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="rl">Role</Label>
            <Select id="rl" value={role} onChange={(e) => setRole(e.target.value as TeammateRole)}>
              {(Object.keys(ROLE_LABEL) as TeammateRole[]).map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-end">
            <Button className="w-full md:w-auto" onClick={() => { spawn(role, name); setName(""); }}>
              <Plus className="size-4" />
              Provision
            </Button>
          </div>
          <div className="flex items-end">
            <Button variant="secondary" className="w-full md:w-auto" onClick={() => applyPack()}>
              Rebrief fleet
            </Button>
          </div>
        </div>
        <p className="mt-3 text-xs text-faint">{ROLE_BLURB[role]}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {teammates.map((m) => {
          const fleet = fleetFor(m.role);
          const duty = dutyFor(m.role);
          return (
            <article key={m.id} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl tracking-tight">{m.name}</h2>
                  <p className="text-xs uppercase tracking-[0.14em] text-faint">{ROLE_LABEL[m.role]}</p>
                </div>
                <Badge tone={statusTone(m.status)}>{m.status}</Badge>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{fleet?.standing ?? ROLE_BLURB[m.role]}</p>
              {duty ? (
                <p className="mt-2 text-sm text-fg">
                  {today ? `${today.day}: ` : ""}
                  {duty}
                </p>
              ) : null}
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-faint">VM</dt>
                  <dd className="font-mono text-xs">{m.vmId}</dd>
                </div>
                <div>
                  <dt className="text-faint">Route</dt>
                  <dd className="font-mono text-xs">
                    {m.model} · {m.effort}
                  </dd>
                </div>
                <div>
                  <dt className="text-faint">Context</dt>
                  <dd className="font-mono tabular-nums">{formatTokens(m.contextTokens)}</dd>
                </div>
                <div>
                  <dt className="text-faint">Note</dt>
                  <dd className="text-muted">{m.lastNote}</dd>
                </div>
              </dl>
              {fleet ? (
                <ul className="mt-4 grid gap-1 border-t border-line pt-3 text-xs text-faint">
                  <li>Mon · {fleet.duties.mon}</li>
                  <li>Wed · {fleet.duties.wed}</li>
                  <li>Fri · {fleet.duties.fri}</li>
                </ul>
              ) : null}
              <div className="mt-4">
                <Button variant="ghost" size="sm" onClick={() => retire(m.id)}>
                  <Trash2 className="size-3.5" />
                  Retire
                </Button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Handoff</p>
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <Select value={fromId} onChange={(e) => setFromId(e.target.value)}>
            {teammates.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>
          <Select value={toId} onChange={(e) => setToId(e.target.value)}>
            {teammates.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>
          <Button
            variant="secondary"
            onClick={() => handoff(fromId, toId)}
            disabled={!fromId || !toId || fromId === toId}
          >
            <ArrowRightLeft className="size-4" />
            Hand off
          </Button>
        </div>
      </section>
    </div>
  );
}
