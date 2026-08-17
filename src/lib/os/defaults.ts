import type {
  ContextWindow,
  Mission,
  OsSnapshot,
  RoutingPolicy,
  Teammate,
} from "./types";
import { DEFAULT_SPEC } from "./spec";

export function makeVmId(seed = "hx0001") {
  return `vm-${seed}`;
}

export function seedTeammates(): Teammate[] {
  const now = 0;
  return [
    {
      id: "tm_atlas",
      name: "Atlas",
      role: "planner",
      status: "idle",
      vmId: makeVmId("atlas01"),
      model: "grok-4.6",
      effort: "xhigh",
      contextTokens: 2400,
      lastNote: "Ready to decompose a goal.",
      createdAt: now,
    },
    {
      id: "tm_forge",
      name: "Forge",
      role: "implementor",
      status: "idle",
      vmId: makeVmId("forge01"),
      model: "grok-4.5",
      effort: "medium",
      contextTokens: 1800,
      lastNote: "Waiting on a thin slice.",
      createdAt: now,
    },
    {
      id: "tm_skeptic",
      name: "Skeptic",
      role: "skeptic",
      status: "idle",
      vmId: makeVmId("skpt01"),
      model: "grok-4.6",
      effort: "high",
      contextTokens: 1600,
      lastNote: "Verification lane clear.",
      createdAt: now,
    },
    {
      id: "tm_arch",
      name: "Archivist",
      role: "archivist",
      status: "idle",
      vmId: makeVmId("arch01"),
      model: "grok-4.5",
      effort: "low",
      contextTokens: 900,
      lastNote: "Fuel write-back idle.",
      createdAt: now,
    },
    {
      id: "tm_courier",
      name: "Courier",
      role: "courier",
      status: "idle",
      vmId: makeVmId("cour01"),
      model: "grok-4.5",
      effort: "low",
      contextTokens: 700,
      lastNote: "Bus subscribed.",
      createdAt: now,
    },
  ];
}

export const DEFAULT_ROUTING: RoutingPolicy = {
  planModel: "grok-4.6",
  planEffort: "xhigh",
  execModel: "grok-4.5",
  execEffort: "medium",
  compactAt: 48_000,
  isolateSubagents: true,
};

export function seedContext(): ContextWindow {
  return {
    tokens: 7400,
    budget: 200_000,
    rotScore: 8,
    lastCompactAt: null,
    stage: "admit",
    notes: ["Session opened. Admitted project AGENTS.md + five teammate cards."],
  };
}

export function emptyMission(goal: string, topology: Mission["topology"]): Mission {
  return {
    id: "ms_pending",
    goal,
    status: "idle",
    topology,
    step: 0,
    maxSteps: 10,
    startedAt: null,
    verifyPasses: 0,
    verifyFails: 0,
  };
}

export function seedSnapshot(): OsSnapshot {
  return {
    version: 1,
    teammates: seedTeammates(),
    events: [
      {
        id: "ev_boot",
        at: 0,
        source: "system",
        kind: "boot",
        payload: "Agent OS console restored. Teammates idle on isolated VMs.",
      },
    ],
    mission: null,
    spec: DEFAULT_SPEC,
    routing: DEFAULT_ROUTING,
    context: seedContext(),
  };
}
