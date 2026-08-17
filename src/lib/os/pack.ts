import type { Effort, RoutingPolicy } from "./types";

export const PACK_VERSION = "2026-08-17";
export const PACK_CYCLE = "monday-new-patterns";

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
