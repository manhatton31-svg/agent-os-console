import type {
  ContextWindow,
  Mission,
  OsSnapshot,
  Teammate,
} from "./types";
import { DEFAULT_SPEC } from "./spec";
import { dutyFor, laneForRole, PACK_DEFAULTS, PACK_FLEET, PACK_VERSION } from "./pack";

export function makeVmId(seed = "hx0001") {
  return `vm-${seed}`;
}

export function seedTeammates(): Teammate[] {
  return PACK_FLEET.map((bot) => {
    const lane = laneForRole(bot.role);
    return {
      id: bot.id,
      name: bot.name,
      role: bot.role,
      status: "idle" as const,
      vmId: makeVmId(bot.vmSeed),
      model: lane.model,
      effort: lane.effort,
      contextTokens: bot.role === "planner" ? 2400 : bot.role === "implementor" ? 1800 : 1200,
      lastNote: dutyFor(bot.role),
      createdAt: 0,
    };
  });
}

export const DEFAULT_ROUTING = { ...PACK_DEFAULTS };

export function seedContext(): ContextWindow {
  return {
    tokens: 7400,
    budget: 200_000,
    rotScore: 8,
    lastCompactAt: null,
    stage: "admit",
    notes: [`Session opened. Agent OS pack ${PACK_VERSION} in force. Fleet briefed.`],
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
        payload: `Agent OS pack ${PACK_VERSION} in force. Atlas, Forge, Skeptic, Archivist, Courier briefed on Mon/Wed/Fri.`,
      },
    ],
    mission: null,
    spec: DEFAULT_SPEC,
    routing: DEFAULT_ROUTING,
    context: seedContext(),
  };
}
