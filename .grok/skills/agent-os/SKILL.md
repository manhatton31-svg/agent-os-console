---
name: agent-os
description: >
  Top-level Agent OS operator for every Grok/xAI build. Load first on any
  product, mission, Helix, Arcly, DealForge, LivingGoals, or Agent OS session.
  Enforces AGENTS.md vs skills split, persistent teammates, context lifecycle,
  model routing (grok-4.6 xhigh for plan, cheaper for exec), and event-bus
  coordination. Triggers on "agent os", "agent-os", "mission", "GROK.md",
  "Monday cycle", "teammates", "fuel", "continuity".
metadata:
  short-description: "Universal Agent OS rules — load before any other product skill"
  version: "2026-08-17"
user-invocable: true
---

# Agent OS (Monday cycle 2026-08-17)

**Read this before building.** Then open the matching specialist:

| Need | Skill |
|---|---|
| Project spec file | `agents-md-maintainer` |
| Isolated bots / Grok Bot pattern | `persistent-teammates` |
| Token window / context rot | `context-lifecycle` |
| Plan vs exec models | `model-routing` |
| Subscribe / publish coordination | `event-bus` |

## Hard rules

1. **AGENTS.md = place.** ≤100 lines. Stack, commands, conventions, constraints, pointers. No SOPs.
2. **SKILL.md = how.** Task knowledge, progressive disclosure. Load on demand.
3. **Teammates have VMs.** Planner + skeptic on grok-4.6 (high/xhigh). Implementors on cheaper exec. Human is escalation only.
4. **Context is a lifecycle.** Admit → place → compact → recover → reuse → govern. Compact before 48k (default) and before the 200k price band.
5. **No direct agent-to-agent calls.** Event bus: subscribe → reason → publish.
6. **Write back.** Persist decisions and mission results. Do not leave state only in the transcript.

## Model routing (Grok 4.6)

- Plan / verify / long-horizon: `grok-4.6` + `xhigh` or `high`
- Execute / courier / archive: `grok-4.5` + `medium` or `low`
- Self-verify after implementor slices (skeptic in a quarantined thread)

## When this skill is present

Any later Build in this workspace must consult these files. Do not re-derive the Monday-cycle patterns from scratch.
