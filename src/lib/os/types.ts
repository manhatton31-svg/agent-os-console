export type TeammateRole =
  | "planner"
  | "implementor"
  | "skeptic"
  | "archivist"
  | "courier";

export type TeammateStatus =
  | "idle"
  | "running"
  | "verifying"
  | "blocked"
  | "handoff"
  | "offline";

export type Topology = "hierarchical" | "event-bus" | "sequential" | "parallel";

export type MissionStatus = "idle" | "running" | "verifying" | "complete" | "failed";

export type Effort = "low" | "medium" | "high" | "xhigh";

export type LifecycleStage =
  | "admit"
  | "place"
  | "compact"
  | "recover"
  | "reuse"
  | "govern";

export interface Teammate {
  id: string;
  name: string;
  role: TeammateRole;
  status: TeammateStatus;
  vmId: string;
  model: string;
  effort: Effort;
  contextTokens: number;
  lastNote: string;
  createdAt: number;
}

export interface BusEvent {
  id: string;
  at: number;
  source: string;
  kind: string;
  payload: string;
}

export interface Mission {
  id: string;
  goal: string;
  status: MissionStatus;
  topology: Topology;
  step: number;
  maxSteps: number;
  startedAt: number | null;
  verifyPasses: number;
  verifyFails: number;
}

export interface SpecDoc {
  project: string;
  stack: string;
  build: string;
  test: string;
  conventions: string;
  constraints: string;
  skills: string[];
}

export interface RoutingPolicy {
  planModel: string;
  planEffort: Effort;
  execModel: string;
  execEffort: Effort;
  compactAt: number;
  isolateSubagents: boolean;
}

export interface ContextWindow {
  tokens: number;
  budget: number;
  rotScore: number;
  lastCompactAt: number | null;
  stage: LifecycleStage;
  notes: string[];
}

export interface OsSnapshot {
  teammates: Teammate[];
  events: BusEvent[];
  mission: Mission | null;
  spec: SpecDoc;
  routing: RoutingPolicy;
  context: ContextWindow;
  version: 1;
}

export const ROLE_LABEL: Record<TeammateRole, string> = {
  planner: "Planner",
  implementor: "Implementor",
  skeptic: "Skeptic",
  archivist: "Archivist",
  courier: "Courier",
};

export const ROLE_BLURB: Record<TeammateRole, string> = {
  planner: "Monday: decompose. Wednesday: confirm landing. Friday: ship / defer / drop.",
  implementor: "Thin slices only. Monday waits. Wednesday closes leftovers. Friday stops.",
  skeptic: "Reject inForce repeats. Wednesday owns Verify. Quarantine first.",
  archivist: "Write back every cycle. Friday compact ≤10 lines of fuel.",
  courier: "Fan Discover / Verify / Close onto the bus. Do not orchestrate.",
};
