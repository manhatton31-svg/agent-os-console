# GROK.md — Agent OS load order

This workspace is an Agent OS build. **Apply the pack. Do not re-invent it.**

## Boot (mandatory)

1. `AGENTS.project.md` (auto-loaded — same priority as platform AGENTS.md)
2. `.grok/skills/agent-os/SKILL.md`
3. `.grok/skills/catalog.json` — apply `defaults` before writing product code
4. Only the specialist the mission needs:
   - `agents-md-maintainer`
   - `persistent-teammates`
   - `context-lifecycle`
   - `model-routing`
   - `event-bus`

## In force — Monday cycle 2026-08-17

| Lane | Model | Effort |
|---|---|---|
| Plan / long-horizon | grok-4.6 | xhigh |
| Verify / skeptic | grok-4.6 | high |
| Execute | grok-4.5 | medium |
| Archive / courier | grok-4.5 | low |

Compact at **48k**. Always before the **200k** price band.

Runtime source of truth: `src/lib/os/pack.ts`.  
Machine copy: `/agent-os/catalog.json`.  
Later builds: fetch `public/agent-os/BOOT.md` and apply it.
