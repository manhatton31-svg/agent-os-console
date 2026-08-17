import { uid } from "@/lib/utils";
import type {
  BusEvent,
  ContextWindow,
  Mission,
  OsSnapshot,
  Teammate,
  TeammateStatus,
  Topology,
} from "./types";

function pushEvent(
  events: BusEvent[],
  source: string,
  kind: string,
  payload: string,
): BusEvent[] {
  const next: BusEvent = { id: uid("ev"), at: Date.now(), source, kind, payload };
  return [next, ...events].slice(0, 80);
}

function byRole(mates: Teammate[], role: Teammate["role"]) {
  return mates.find((m) => m.role === role);
}

const PLAN_STEPS = [
  "Admitted goal into isolated planner VM.",
  "Decomposed into thin slices. Routed plan → grok-4.6 xhigh.",
  "Published work items on the event bus.",
  "Implementor claimed slice. Exec model on cheap effort.",
  "Wrote draft output. Context grew; recency window kept last 5 tool calls.",
  "Skeptic opened a quarantine thread for verification.",
  "Self-check against success criteria.",
  "Archivist compacted notes and wrote fuel.",
  "Courier merged results. Human is the escalation point only.",
  "Mission closed. Durable write-back complete.",
];

export function tickSnapshot(state: OsSnapshot): OsSnapshot {
  const mission = state.mission;
  if (!mission || (mission.status !== "running" && mission.status !== "verifying")) {
    return state;
  }

  const step = mission.step + 1;
  const note = PLAN_STEPS[Math.min(step - 1, PLAN_STEPS.length - 1)];
  let events = [...state.events];
  let mates = state.teammates.map((m) => ({ ...m }));
  let ctx: ContextWindow = { ...state.context, notes: [...state.context.notes] };
  const nextMission: Mission = { ...mission, step };

  const planner = byRole(mates, "planner");
  const impl = byRole(mates, "implementor");
  const skeptic = byRole(mates, "skeptic");
  const arch = byRole(mates, "archivist");
  const courier = byRole(mates, "courier");

  const grow = (
    m: Teammate | undefined,
    n: number,
    status: Teammate["status"],
    lastNote: string,
  ) => {
    if (!m) return;
    m.contextTokens += n;
    m.status = status;
    m.lastNote = lastNote;
  };

  if (state.routing.isolateSubagents) {
    ctx.stage =
      step <= 2
        ? "admit"
        : step <= 4
          ? "place"
          : step <= 6
            ? "compact"
            : step === 7
              ? "recover"
              : step === 8
                ? "reuse"
                : "govern";
  }

  if (step <= 2) {
    grow(planner, 1800, "running", note);
    grow(courier, 120, "running", "Fan-out published.");
    events = pushEvent(events, planner?.name ?? "Atlas", "plan", note);
    ctx.tokens += 2200;
    ctx.rotScore = Math.min(92, ctx.rotScore + 6);
  } else if (step <= 5) {
    grow(planner, 200, "handoff", "Handed slices to implementor.");
    grow(impl, 2400, "running", note);
    grow(courier, 180, "running", `Topology: ${mission.topology}`);
    events = pushEvent(events, impl?.name ?? "Forge", "exec", note);
    ctx.tokens += 3100;
    ctx.rotScore = Math.min(92, ctx.rotScore + 8);
  } else if (step === 6 || step === 7) {
    nextMission.status = "verifying";
    grow(impl, 300, "handoff", "Awaiting skeptic.");
    grow(skeptic, 1600, "verifying", note);
    const fail = step === 6 && nextMission.verifyFails === 0;
    if (fail) {
      nextMission.verifyFails += 1;
      grow(skeptic, 400, "blocked", "Found a shared blind spot. Sent back.");
      grow(impl, 200, "running", "Revising after skeptic flag.");
      events = pushEvent(
        events,
        skeptic?.name ?? "Skeptic",
        "verify-fail",
        "Blind spot: implementor missed an invariant.",
      );
      ctx.rotScore = Math.min(96, ctx.rotScore + 4);
    } else {
      nextMission.verifyPasses += 1;
      events = pushEvent(
        events,
        skeptic?.name ?? "Skeptic",
        "verify-ok",
        "Self-check passed. Work is shippable.",
      );
    }
    ctx.tokens += 1800;
  } else {
    grow(arch, 700, "running", note);
    grow(courier, 150, "running", "Merging isolated threads.");
    events = pushEvent(events, arch?.name ?? "Archivist", "write-back", note);
    ctx.tokens += 900;
    ctx.stage = "govern";
  }

  if (ctx.tokens >= state.routing.compactAt) {
    const before = ctx.tokens;
    ctx.tokens = Math.max(4200, Math.round(ctx.tokens * 0.38));
    ctx.rotScore = Math.max(6, Math.round(ctx.rotScore * 0.45));
    ctx.lastCompactAt = Date.now();
    ctx.stage = "compact";
    ctx.notes = [`Compacted ${before} → ${ctx.tokens} tokens (recency + summary).`, ...ctx.notes].slice(
      0,
      12,
    );
    events = pushEvent(events, "context", "compact", `Pruned to last tool window. ${before} → ${ctx.tokens}.`);
    if (arch) {
      arch.lastNote = "Compaction + fuel write complete.";
      arch.status = "running";
    }
  }

  if (step >= mission.maxSteps) {
    nextMission.status = nextMission.verifyFails > nextMission.verifyPasses ? "failed" : "complete";
    const closed: Teammate["status"] =
      nextMission.status === "complete" ? "idle" : "idle";
    mates = mates.map((m) => ({
      ...m,
      status: nextMission.status === "failed" && m.role === "skeptic" ? "blocked" : closed,
      lastNote:
        nextMission.status === "complete" ? "Idle. Last mission wrote back." : m.lastNote,
    }));
    events = pushEvent(
      events,
      "system",
      nextMission.status === "complete" ? "done" : "fail",
      nextMission.status === "complete"
        ? "Mission complete. Human never left the escalation seat."
        : "Mission failed verification budget.",
    );
    ctx.notes = ["Mission closed.", ...ctx.notes].slice(0, 12);
  }

  ctx.notes = [note, ...ctx.notes].slice(0, 12);

  return {
    ...state,
    teammates: mates,
    events,
    mission: nextMission,
    context: ctx,
  };
}

export function startMission(state: OsSnapshot, goal: string, topology: Topology): OsSnapshot {
  const mission: Mission = {
    id: uid("ms"),
    goal,
    status: "running",
    topology,
    step: 0,
    maxSteps: 10,
    startedAt: Date.now(),
    verifyPasses: 0,
    verifyFails: 0,
  };
  const events = pushEvent(state.events, "system", "mission", `Started “${goal}” via ${topology}.`);
  const teammates = state.teammates.map((m) => {
    const status: TeammateStatus =
      m.role === "planner" || m.role === "courier" ? "running" : "idle";
    return {
      ...m,
      status,
      lastNote: m.role === "planner" ? "Planning first pass." : m.lastNote,
    };
  });
  return {
    ...state,
    mission,
    events,
    teammates,
    context: {
      ...state.context,
      stage: "admit",
      notes: [`Admitted mission: ${goal}`, ...state.context.notes].slice(0, 12),
    },
  };
}

export function compactNow(state: OsSnapshot): OsSnapshot {
  const before = state.context.tokens;
  const tokens = Math.max(2800, Math.round(before * 0.34));
  return {
    ...state,
    context: {
      ...state.context,
      tokens,
      rotScore: Math.max(4, Math.round(state.context.rotScore * 0.4)),
      lastCompactAt: Date.now(),
      stage: "compact",
      notes: [`Manual compact ${before} → ${tokens}.`, ...state.context.notes].slice(0, 12),
    },
    events: pushEvent(state.events, "context", "compact", `Manual compact ${before} → ${tokens}.`),
    teammates: state.teammates.map((m) =>
      m.role === "archivist"
        ? { ...m, lastNote: "Manual compaction applied.", status: "running" }
        : m,
    ),
  };
}

export function quarantine(state: OsSnapshot): OsSnapshot {
  return {
    ...state,
    context: {
      ...state.context,
      stage: "place",
      notes: ["Opened isolated skeptic thread (context quarantine).", ...state.context.notes].slice(
        0,
        12,
      ),
    },
    events: pushEvent(
      state.events,
      "system",
      "isolate",
      "Sub-agent thread isolated. Parent context unchanged.",
    ),
    teammates: state.teammates.map((m) =>
      m.role === "skeptic" ? { ...m, status: "verifying", lastNote: "Quarantine thread live." } : m,
    ),
  };
}
