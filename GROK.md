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

## Weekly scans (09:00 America/New_York)

| Day | Role | Automation |
|---|---|---|
| Monday | Discover | `new-patterns-scan-mon` |
| Wednesday | Verify | `new-patterns-scan-wed` |
| Friday | Close | `new-patterns-scan-fri` |

Each run fetches this catalog first. Do not re-recommend anything in `inForce`.

## In force — weekly pack 2026-08-17.2

| Lane | Model | Effort |
|---|---|---|
| Plan / long-horizon | grok-4.6 | xhigh |
| Verify / skeptic | grok-4.6 | high |
| Execute | grok-4.5 | medium |
| Archive / courier | grok-4.5 | low |

Compact at **48k**. Always before the **200k** price band.

Runtime source of truth: `src/lib/os/pack.ts`.
