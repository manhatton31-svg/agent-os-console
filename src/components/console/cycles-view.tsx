import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { currentScan, PACK_IN_FORCE, PACK_SCANS, PACK_VERSION } from "@/lib/os/pack";

export function CyclesView() {
  const today = currentScan();

  return (
    <div className="grid gap-6">
      <section>
        <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Weekly cadence</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight md:text-4xl">
          Monday discovers. Wednesday verifies. Friday closes.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Three live automations, 09:00 Eastern. Each run must fetch the pack
          catalog first and skip anything already in force. They do not invent
          a parallel Agent OS.
        </p>
        {today ? (
          <p className="mt-3 text-sm text-ok">
            Today is {today.day} — {today.role} cycle.
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted">No scan today. Next is the coming Monday, Wednesday, or Friday.</p>
        )}
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {PACK_SCANS.map((scan) => {
          const active = today?.id === scan.id;
          return (
            <article
              key={scan.id}
              className="rounded-xl border border-line bg-surface p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-muted" />
                  <p className="text-sm">{scan.day}</p>
                </div>
                <Badge tone={active ? "ok" : "neutral"}>{scan.role}</Badge>
              </div>
              <p className="mt-4 font-mono text-xs text-faint">
                {scan.time} {scan.timezone.replace("_", " ")}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{scan.focus}</p>
              <p className="mt-4 font-mono text-[11px] text-faint">{scan.automation}</p>
            </article>
          );
        })}
      </section>

      <aside className="rounded-xl border border-line bg-surface p-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-faint">
          Already in force · {PACK_VERSION}
        </p>
        <p className="mt-2 text-sm text-muted">
          Wed and Fri must not re-recommend these. Compare against the catalog, then report only new or under-captured items.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {PACK_IN_FORCE.map((item) => (
            <li key={item} className="text-sm leading-relaxed text-muted">
              {item}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
