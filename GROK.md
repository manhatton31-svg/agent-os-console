# GROK.md — Agent OS load order

Every build in this workspace that uses Agent OS **must** load in this order:

1. `AGENTS.project.md` (project facts)
2. `.grok/skills/agent-os/SKILL.md` (operator)
3. Only the specialist skills the mission needs:
   - `agents-md-maintainer`
   - `persistent-teammates`
   - `context-lifecycle`
   - `model-routing`
   - `event-bus`

Do not re-invent these patterns. Version: **2026-08-17 Monday cycle**.

Default routing: plan/verify on **grok-4.6** (xhigh/high); execute on **grok-4.5** (medium/low). Compact before 48k tokens.
