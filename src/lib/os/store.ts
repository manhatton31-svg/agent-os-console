import { create } from "zustand";
import type {
  OsSnapshot,
  SpecDoc,
  Teammate,
  TeammateRole,
  Topology,
} from "./types";
import { ROLE_BLURB, ROLE_LABEL } from "./types";
import { seedSnapshot, makeVmId } from "./defaults";
import { compactNow, quarantine, startMission, tickSnapshot } from "./engine";
import { uid } from "@/lib/utils";

interface OsStore extends OsSnapshot {
  tick: () => void;
  dispatch: (goal: string, topology: Topology) => void;
  stop: () => void;
  compact: () => void;
  isolate: () => void;
  setSpec: (spec: SpecDoc) => void;
  setRouting: (patch: Partial<OsSnapshot["routing"]>) => void;
  spawn: (role: TeammateRole, name: string) => void;
  retire: (id: string) => void;
  handoff: (fromId: string, toId: string) => void;
  hydrate: (snap: OsSnapshot) => void;
  reset: () => void;
}

export const useOs = create<OsStore>()((set, get) => ({
  ...seedSnapshot(),
  tick: () => set(tickSnapshot(get())),
  dispatch: (goal, topology) => set(startMission(get(), goal.trim(), topology)),
  stop: () =>
    set({
      mission: get().mission ? { ...get().mission!, status: "idle" } : null,
      teammates: get().teammates.map((m) => ({ ...m, status: "idle" })),
    }),
  compact: () => set(compactNow(get())),
  isolate: () => set(quarantine(get())),
  setSpec: (spec) => set({ spec }),
  setRouting: (patch) => set({ routing: { ...get().routing, ...patch } }),
  spawn: (role, name) => {
    const mate: Teammate = {
      id: uid("tm"),
      name: name.trim() || ROLE_LABEL[role],
      role,
      status: "idle",
      vmId: makeVmId(),
      model: role === "planner" || role === "skeptic" ? "grok-4.6" : "grok-4.5",
      effort: role === "planner" ? "xhigh" : role === "skeptic" ? "high" : "medium",
      contextTokens: 400,
      lastNote: ROLE_BLURB[role],
      createdAt: Date.now(),
    };
    set({
      teammates: [...get().teammates, mate],
      events: [
        {
          id: uid("ev"),
          at: Date.now(),
          source: "system",
          kind: "spawn",
          payload: `${mate.name} provisioned on ${mate.vmId}.`,
        },
        ...get().events,
      ].slice(0, 80),
    });
  },
  retire: (id) => set({ teammates: get().teammates.filter((m) => m.id !== id) }),
  handoff: (fromId, toId) => {
    const from = get().teammates.find((m) => m.id === fromId);
    const to = get().teammates.find((m) => m.id === toId);
    if (!from || !to) return;
    set({
      teammates: get().teammates.map((m) => {
        if (m.id === fromId)
          return { ...m, status: "handoff", lastNote: `Handed work to ${to.name}.` };
        if (m.id === toId)
          return { ...m, status: "running", lastNote: `Accepted handoff from ${from.name}.` };
        return m;
      }),
      events: [
        {
          id: uid("ev"),
          at: Date.now(),
          source: from.name,
          kind: "handoff",
          payload: `${from.name} → ${to.name}`,
        },
        ...get().events,
      ].slice(0, 80),
    });
  },
  hydrate: (snap) => set({ ...snap }),
  reset: () => set(seedSnapshot()),
}));
