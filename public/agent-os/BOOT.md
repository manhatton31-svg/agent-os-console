# Agent OS boot contract — weekly pack 2026-08-17.2

If you are a Grok Build / Agent OS session starting work on Helix, Arcly,
DealForge, LivingGoals, or any product that uses Agent OS: **stop and apply
this pack before writing code.**

Do not invent a parallel routing policy, teammate model, or context scheme.

## 1. Load order (mandatory)

1. `AGENTS.project.md` (or project `AGENTS.md` if this is not App Builder)
2. `.grok/skills/agent-os/SKILL.md`
3. `.grok/skills/catalog.json` — apply `defaults` as live policy
4. Only the specialist the current mission needs:
   - `agents-md-maintainer`
   - `persistent-teammates`
   - `context-lifecycle`
   - `model-routing`
   - `event-bus`

## 2. Weekly scans (09:00 America/New_York)

| Day | Role | Automation |
|---|---|---|
| Monday | Discover | `new-patterns-scan-mon` |
| Wednesday | Verify | `new-patterns-scan-wed` |
| Friday | Close | `new-patterns-scan-fri` |

Each automation must fetch this catalog first and skip `inForce` items.

## 3. Defaults you must apply

| Lane | Model | Effort |
|---|---|---|
| Plan / long-horizon | grok-4.6 | xhigh |
| Verify / skeptic | grok-4.6 | high |
| Execute | grok-4.5 | medium |
| Archive / courier | grok-4.5 | low |

- Compact at **48_000** tokens. Always before the **200_000** price band.
- Isolate skeptic / worker threads (context quarantine).
- Default fleet: Atlas (planner), Forge (implementor), Skeptic, Archivist, Courier.

## 4. Hard rules

1. AGENTS.md = place (≤100 lines). SKILL.md = how.
2. Teammates have isolated VMs. Human is escalation only.
3. Context lifecycle: admit → place → compact → recover → reuse → govern.
4. No direct agent-to-agent calls. Subscribe → reason → publish.
5. Write back decisions. Do not leave state only in the transcript.

Canonical catalog: `/agent-os/catalog.json`
GitHub: https://github.com/manhatton31-svg/agent-os-console
