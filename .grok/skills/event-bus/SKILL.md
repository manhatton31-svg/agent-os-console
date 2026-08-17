---
name: event-bus
description: >
  Event-driven multi-agent topology: subscribe, reason, publish. Optional
  hierarchical / sequential / parallel / saga. Triggers on "event bus",
  "event-driven", "pubsub", "topology", "saga", "fan-out".
metadata:
  short-description: "Agents coordinate via events, not direct calls"
  version: "2026-08-17"
user-invocable: true
---

# Event bus

Agents do not call each other. They subscribe → reason → publish.

## Topologies
- **hierarchical** — planner fans out, merges results (default)
- **event-bus** — specialists react independently
- **sequential** — handoff chain
- **parallel** — same event, many workers
- **saga** — long-running + compensations

## Contract
Every teammate: subscribe, reason, publish. Shared state lives on the bus and in Archivist write-back — not in a hidden parent prompt.

See `persistent-teammates`.
