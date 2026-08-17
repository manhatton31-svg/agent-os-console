# Agent OS boot contract — Monday cycle 2026-08-17

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

## 2. Defaults you must apply

| Lane | Model | Effort |
|---|---|---|
| Plan / long-horizon | grok-4.6 | xhigh |
| Verify / skeptic | grok-4.6 | high |
| Execute | grok-4.5 | medium |
| Archive / courier | grok-4.5 | low |

- Compact at **48_000** tokens. Always before the **200_000** price band.
- Isolate skeptic / worker threads (context quarantine).
- Default fleet: Atlas (planner), Forge (implementor), Skeptic, Archivist, Courier.

## 3. Hard rules

1. AGENTS.md = place (≤100 lines). SKILL.md = how.
2. Teammates have isolated VMs. Human is escalation only.
3. Context lifecycle: admit → place → compact → recover → reuse → govern.
4. No direct agent-to-agent calls. Subscribe → reason → publish.
5. Write back decisions. Do not leave state only in the transcript.

## 4. How to install into a new workspace

Copy these folders from https://github.com/manhatton31-svg/agent-os-console:

- `.grok/skills/agent-os`
- `.grok/skills/agents-md-maintainer`
- `.grok/skills/persistent-teammates`
- `.grok/skills/context-lifecycle`
- `.grok/skills/model-routing`
- `.grok/skills/event-bus`
- `.grok/skills/catalog.json`
- `GROK.md`

Then add this to the project instructions file (AGENTS.project.md or AGENTS.md):

```
If `.grok/skills/agent-os/SKILL.md` exists, load it and catalog.json
before writing product code. Apply catalog defaults. Do not re-invent
teammates, routing, context lifecycle, or the event bus.
```

Canonical catalog: `/agent-os/catalog.json`
GitHub: https://github.com/manhatton31-svg/agent-os-console
