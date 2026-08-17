---
name: persistent-teammates
description: >
  Grok Bot-style teammates: isolated VM, role, model/effort pair, event-bus
  handoff. Use the Agent OS pack fleet. Human is the escalation point only.
  Triggers on "teammate", "Grok Bot", "subagent", "multi-agent", "handoff",
  "spawn agent", "fleet", "Atlas", "Forge", "update the bots".
metadata:
  short-description: "Persistent isolated teammates with weekly cycle briefs"
  version: "2026-08-17.3"
user-invocable: true
---

# Persistent teammates

## Contract
- Each teammate: `vmId`, role, model, effort, private context budget.
- Roles: planner, implementor, skeptic, archivist, courier.
- Coordination is subscribe → reason → publish (`event-bus` skill).
- Planner / skeptic: expensive model + high/xhigh (`model-routing`).
- Implementor / courier / archivist: cheaper execution.

## Isolation
- Skeptic verification runs in a quarantined thread (`context-lifecycle`).
- Parent context receives a summary, not the raw transcript.

## Escalation
- Human approves kernel writes, payments, deploys, policy changes.
- Admitted missions run without waiting for a prompt between steps.

## Default fleet (weekly briefs)

| Bot | Role | Monday | Wednesday | Friday |
|---|---|---|---|---|
| Atlas | planner | Decompose into implement / note / ignore. Skip inForce. | Confirm Monday landed on pack + Arcly. | Ship / defer / drop leftovers. |
| Forge | implementor | Idle until Atlas marks implement. | Close one leftover slice. | No new work. Finish or defer. |
| Skeptic | skeptic | Reject anything already inForce. | Own Verify. Did Monday land? | Refuse re-opens Friday dropped. |
| Archivist | archivist | Log implement items to ARC-64 + Notion. | Record landed vs open. | Compact ≤10 lines of fuel. |
| Courier | courier | Fan Discover onto the bus. | Fan Verify. Flag Arcly drift. | Publish the fuel block. |

Source of truth: `catalog.fleet` / `src/lib/os/pack.ts` `PACK_FLEET`. Rebrief with applyPack after any pack bump.

Do not add a sixth default bot. Do not invent a parallel fleet.
