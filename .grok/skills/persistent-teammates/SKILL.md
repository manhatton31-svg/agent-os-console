---
name: persistent-teammates
description: >
  Grok Bot-style teammates: isolated VM, role, model/effort pair, event-bus
  handoff. Human is the escalation point only. Triggers on "teammate",
  "Grok Bot", "subagent", "multi-agent", "handoff", "spawn agent", "fleet".
metadata:
  short-description: "Persistent isolated teammates with plan/exec/skeptic roles"
  version: "2026-08-17"
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

## Default fleet
Atlas (planner) · Forge (implementor) · Skeptic · Archivist · Courier
