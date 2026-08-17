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
import { laneForRole, PACK_DEFAULTS, PACK_SKILLS } from "./pack";
import { uid } from "@/lib/utils";

interface OsStore extends OsSnapshot {
  tick: () => void;
  dispatch: (goal: string, topology: Topology) => void;
  stop: () => void;
  compact: () => void;
  isolate: () => void;
  setSpec: (spec: SpecDoc) => void;
  setRouting: (patch: Partial<OsSnapshot["routing"]>) => void;
  applyPack: () => void;
  spawn: (role: TeammateRole, name: string) => void;
  retire: (id: string) => void;
  handoff: (fromId: string, toId: string) => void;
  hydrate: (snap: OsSnapshot) => void;
  reset: () => void;
}

function mergePackSkills(skills: string[]) {
  const extra = PACK_SKILLS.filter((s) => s !== "agent-os" && !skills.includes(s));
  return extra.length ? [...skills, ...extra] : skills;
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
  applyPack: () => {
    const state = get();
    set({
      routing: { ...PACK_DEFAULTS },
      spec: { ...state.spec, skills: mergePackSkills(state.spec.skills) },
      teammates: state.teammates.map((m) => {
        const lane = laneForRole(m.role);
        return { ...m, model: lane.model, effort: lane.effort };
      }),
      events: [
        {
          id: uid("ev"),
          at: Date.now(),
          source: "system",
          kind: "pack",
          payload: "Monday-cycle pack reapplied. Routing, lanes, and required skills restored.",
        },
        ...state.events,
      ].slice(0, 80),
    });
  },
  spawn: (role, name) => {
    const lane = laneForRole(role);
    const mate: Teammate = {
      id: uid("tm"),
      name: name.trim() || ROLE_LABEL[role],
      role,
      status: "idle",
      vmId: makeVmId(),
      model: lane.model,
      effort: lane.effort,
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
          payload: `${mate.name} provisioned on ${mate.vmId} · ${mate.model} ${mate.effort}.`,
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
  hydrate: (snap) =>
    set({
      ...snap,
      routing: { ...PACK_DEFAULTS, ...snap.routing },
      spec: {
        ...snap.spec,
        skills: mergePackSkills(snap.spec.skills ?? []),
      },
    }),
  reset: () => set(seedSnapshot()),
}));
