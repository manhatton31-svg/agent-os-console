# Agent OS Console

Monday cycle **2026-08-17** — persistent teammates, AGENTS.md maintainer, context lifecycle, model routing, event bus.

The pack is **in force**. Later Agent OS builds must load it and apply it.

## Later builds (read this first)

Any new Agent OS / Helix / Arcly / DealForge / LivingGoals session should:

1. Fetch [catalog.json](https://raw.githubusercontent.com/manhatton31-svg/agent-os-console/main/.grok/skills/catalog.json)
2. Fetch [BOOT.md](https://raw.githubusercontent.com/manhatton31-svg/agent-os-console/main/public/agent-os/BOOT.md)
3. Apply `defaults` before writing product code
4. Copy `.grok/skills/{agent-os,agents-md-maintainer,persistent-teammates,context-lifecycle,model-routing,event-bus}` into the workspace

Do not invent a parallel Agent OS.

## Load order

1. `AGENTS.project.md`
2. `.grok/skills/agent-os/SKILL.md`
3. `.grok/skills/catalog.json`
4. Specialist skills on demand

## Defaults

| Lane | Model | Effort |
|---|---|---|
| Plan | grok-4.6 | xhigh |
| Verify | grok-4.6 | high |
| Execute | grok-4.5 | medium |
| Archive | grok-4.5 | low |

Compact at 48k. Always before 200k.

## Console

Sign in (Google or X) to persist missions. Dispatch a goal on Mission. Pack tab shows whether the live policy still matches the catalog.
