import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useOs } from "@/lib/os/store";

export function EventsView() {
  const events = useOs((s) => s.events);
  const topology = useOs((s) => s.mission?.topology ?? "event-bus");

  return (
    <div className="grid gap-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Bus</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Subscribe, reason, publish</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Agents do not call each other. They react to domain events. Current
          topology: <span className="text-fg">{topology}</span>.
        </p>
      </header>

      <ol className="grid gap-2">
        {events.length === 0 ? (
          <li className="rounded-xl border border-line bg-surface p-6 text-sm text-muted">
            Bus is quiet. Dispatch a mission to see traffic.
          </li>
        ) : (
          events.map((ev) => (
            <li
              key={ev.id}
              className="grid gap-1 rounded-xl border border-line bg-surface px-4 py-3 sm:grid-cols-[7rem_6rem_1fr_auto] sm:items-center"
            >
              <span className="text-sm">{ev.source}</span>
              <Badge>{ev.kind}</Badge>
              <span className="text-sm text-muted">{ev.payload}</span>
              <span className="font-mono text-[11px] text-faint">
                {formatDistanceToNow(ev.at, { addSuffix: true })}
              </span>
            </li>
          ))
        )}
      </ol>
    </div>
  );
}
