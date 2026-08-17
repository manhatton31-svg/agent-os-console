import type { Effort, RoutingPolicy, Teammate, TeammateRole } from "./types";

export const PACK_VERSION = "2026-08-17.3";
export const PACK_CYCLE = "weekly-new-patterns";

export const PACK_SKILLS = [
  "agent-os",
  "agents-md-maintainer",
  "persistent-teammates",
  "context-lifecycle",
  "model-routing",
  "event-bus",
] as const;

export const PACK_LOAD_ORDER = [
  "AGENTS.project.md",
  "GROK.md",
  "agent-os",
  "agents-md-maintainer",
  "persistent-teammates",
  "context-lifecycle",
  "model-routing",
  "event-bus",
] as const;

export const PACK_DEFAULTS: RoutingPolicy = {
  planModel: "grok-4.6",
  planEffort: "xhigh",
  execModel: "grok-4.5",
  execEffort: "medium",
  compactAt: 48_000,
  isolateSubagents: true,
};

export const PACK_LANES = [
  {
    lane: "Plan / decompose / long-horizon",
    model: "grok-4.6",
    effort: "xhigh" as Effort,
    roles: ["planner"],
  },
  {
    lane: "Verify / skeptic",
    model: "grok-4.6",
    effort: "high" as Effort,
    roles: ["skeptic"],
  },
  {
    lane: "Execute / implement",
    model: "grok-4.5",
    effort: "medium" as Effort,
    roles: ["implementor"],
  },
  {
    lane: "Archive / courier",
    model: "grok-4.5",
    effort: "low" as Effort,
    roles: ["archivist", "courier"],
  },
] as const;

export const PACK_RULES = [
  "AGENTS.md is place (≤100 lines). SKILL.md is how.",
  "Teammates run on isolated VMs. Human is escalation only.",
  "Context is a lifecycle: admit → place → compact → recover → reuse → govern.",
  "Compact at 48k. Always before the 200k price band.",
  "No direct agent-to-agent calls. Subscribe → reason → publish.",
  "Write back decisions. Do not leave state only in the transcript.",
] as const;

export const PACK_SCANS = [
  {
    id: "mon",
    day: "Monday",
    role: "Discover",
    time: "09:00",
    timezone: "America/New_York",
    automation: "new-patterns-scan-mon",
    taskId: "b5445ac5-bfba-43e6-ada5-c7f54f5b5f45",
    focus:
      "Broad 7–14 day scan. Official Grok/xAI, routing, long-horizon, event-driven agents. Recommend implement only if it is not already in this pack.",
  },
  {
    id: "wed",
    day: "Wednesday",
    role: "Verify",
    time: "09:00",
    timezone: "America/New_York",
    automation: "new-patterns-scan-wed",
    taskId: "3fb420ff-f903-410b-8f3e-1bddd1cd2d1b",
    focus:
      "Did Monday’s implement items land? Mid-week scan of skills/SOPs, context Write/Select/Compress/Isolate, MCP and memory. Do not re-litigate routing or long-horizon unless new since Monday.",
  },
  {
    id: "fri",
    day: "Friday",
    role: "Close",
    time: "09:00",
    timezone: "America/New_York",
    automation: "new-patterns-scan-fri",
    taskId: "2ec58498-e59a-4a60-805e-952cca239e17",
    focus:
      "Week-close scan. Long-horizon and self-improving leftovers. Ship, defer, or drop each open item. Compact ≤10 lines of fuel for next Monday.",
  },
] as const;

export const PACK_IN_FORCE = [
  "AGENTS.md vs SKILL.md split (≤100 lines)",
  "Persistent teammates / Grok Bot fleet (Atlas, Forge, Skeptic, Archivist, Courier)",
  "Context lifecycle admit → place → compact → recover → reuse → govern",
  "Model routing grok-4.6 xhigh plan / grok-4.5 medium exec",
  "Event bus subscribe → reason → publish",
  "Compact at 48k; isolate skeptic threads",
  "Arcly v2 is a required pack consumer",
] as const;

export const PACK_FLEET = [
  {
    id: "tm_atlas",
    name: "Atlas",
    role: "planner" as const satisfies TeammateRole,
    vmSeed: "atlas01",
    standing: "Decompose goals. Route expensive reasoning. Human is escalation only.",
    duties: {
      mon: "Decompose new patterns into implement / note / ignore. Skip inForce.",
      wed: "Confirm Monday items landed on the pack and on Arcly.",
      fri: "Ship, defer, or drop leftovers.",
    },
  },
  {
    id: "tm_forge",
    name: "Forge",
    role: "implementor" as const satisfies TeammateRole,
    vmSeed: "forge01",
    standing: "Execute thin slices on the cheap exec lane. Do not invent a second pack.",
    duties: {
      mon: "Idle until Atlas marks implement. One slice only.",
      wed: "Close any Monday implement leftover — one slice.",
      fri: "No new work. Finish or defer.",
    },
  },
  {
    id: "tm_skeptic",
    name: "Skeptic",
    role: "skeptic" as const satisfies TeammateRole,
    vmSeed: "skpt01",
    standing: "Verify in a quarantined thread. Flag shared blind spots.",
    duties: {
      mon: "Reject any recommendation already in inForce.",
      wed: "Own Verify. Did Monday actually land?",
      fri: "Refuse re-opens that Friday already dropped.",
    },
  },
  {
    id: "tm_arch",
    name: "Archivist",
    role: "archivist" as const satisfies TeammateRole,
    vmSeed: "arch01",
    standing: "Write back decisions. Compact fuel. AGENTS.md stays ≤100 lines.",
    duties: {
      mon: "Log implement items to Linear ARC-64 and Notion continuity.",
      wed: "Record landed vs open. Do not stack recaps.",
      fri: "Compact ≤10 lines of fuel for next Monday.",
    },
  },
  {
    id: "tm_courier",
    name: "Courier",
    role: "courier" as const satisfies TeammateRole,
    vmSeed: "cour01",
    standing: "Subscribe → reason → publish. No direct agent-to-agent calls.",
    duties: {
      mon: "Fan Discover findings onto the bus. Do not orchestrate.",
      wed: "Fan Verify results. Flag Arcly if the pack drifted.",
      fri: "Publish the fuel block. Close the week.",
    },
  },
] as const;

export const PACK_CONSUMERS = [
  {
    name: "arcly-v2",
    repo: "manhatton31-svg/arcly-v2",
    required: true,
    sync: "pull",
    cadence: "hourly",
    path: ".grok/skills",
    workflow: ".github/workflows/sync-agent-os-pack.yml",
    dispatch: "agent-os-pack-updated",
  },
] as const;

export const PACK_CANONICAL = {
  github: "https://github.com/manhatton31-svg/agent-os-console",
  rawCatalog:
    "https://raw.githubusercontent.com/manhatton31-svg/agent-os-console/main/.grok/skills/catalog.json",
  rawBoot:
    "https://raw.githubusercontent.com/manhatton31-svg/agent-os-console/main/public/agent-os/BOOT.md",
  livePack: "/agent-os/catalog.json",
  liveBoot: "/agent-os/BOOT.md",
} as const;

export const AGENT_OS_PACK = {
  version: PACK_VERSION,
  cycle: PACK_CYCLE,
  status: "in-force" as const,
  required: true,
  applyOnBoot: true,
  loadOrder: [...PACK_LOAD_ORDER],
  requiredSkills: [...PACK_SKILLS],
  defaults: { ...PACK_DEFAULTS },
  lanes: PACK_LANES.map((l) => ({ ...l, roles: [...l.roles] })),
  rules: [...PACK_RULES],
  scans: PACK_SCANS.map((s) => ({ ...s })),
  inForce: [...PACK_IN_FORCE],
  fleet: PACK_FLEET.map((b) => ({
    name: b.name,
    role: b.role,
    standing: b.standing,
    duties: { ...b.duties },
  })),
  consumers: PACK_CONSUMERS.map((c) => ({ ...c })),
  canonical: { ...PACK_CANONICAL },
};

export function routingMatchesPack(routing: RoutingPolicy) {
  return (
    routing.planModel === PACK_DEFAULTS.planModel &&
    routing.planEffort === PACK_DEFAULTS.planEffort &&
    routing.execModel === PACK_DEFAULTS.execModel &&
    routing.execEffort === PACK_DEFAULTS.execEffort &&
    routing.compactAt === PACK_DEFAULTS.compactAt &&
    routing.isolateSubagents === PACK_DEFAULTS.isolateSubagents
  );
}

export function laneForRole(role: string) {
  return PACK_LANES.find((l) => (l.roles as readonly string[]).includes(role)) ?? PACK_LANES[2];
}

export function currentScan(now = new Date()) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "America/New_York",
  }).format(now);
  if (weekday === "Wed") return PACK_SCANS[1];
  if (weekday === "Fri") return PACK_SCANS[2];
  if (weekday === "Mon") return PACK_SCANS[0];
  return null;
}

export function fleetFor(role: string) {
  return PACK_FLEET.find((b) => b.role === role);
}

export function dutyFor(role: string, now = new Date()) {
  const bot = fleetFor(role);
  if (!bot) return "";
  const scan = currentScan(now);
  if (!scan) return bot.standing;
  return bot.duties[scan.id];
}

export function overlayFleet(mates: Teammate[]): Teammate[] {
  return mates.map((m) => {
    const lane = laneForRole(m.role);
    return {
      ...m,
      model: lane.model,
      effort: lane.effort,
      lastNote: m.status === "idle" ? dutyFor(m.role) || m.lastNote : m.lastNote,
    };
  });
}
