---
name: agent-os
description: >
  REQUIRED first skill on any Agent OS, Helix, Arcly, DealForge, LivingGoals,
  mission, teammate, or GROK.md session. Apply catalog.json defaults — do not
  re-invent routing, teammates, context lifecycle, or the event bus. Triggers
  on "agent os", "agent-os", "mission", "GROK.md", "Monday cycle", "teammates",
  "fuel", "continuity", "boot pack", "in force", "helix", "arcly".
metadata:
  short-description: "Universal Agent OS rules — load and APPLY before any other product skill"
  version: "2026-08-17"
user-invocable: true
---

# Agent OS (Monday cycle 2026-08-17)

**Apply this pack. Do not re-derive it.**

Open `.grok/skills/catalog.json` and use its `defaults` as the live policy.
Then open only the specialist the mission needs:

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

## Required consumers

**Arcly v2 must stay on this pack.** Repo: `manhatton31-svg/arcly-v2`.

After any pack change:
1. Push this repo (`agent-os-console`)
2. Arcly pulls automatically (GitHub Action every 6 hours, or `sh scripts/sync-agent-os-pack.sh` in that repo)

Do not ship an Agent OS upgrade that is not on Arcly v2.

## Later builds

If this skill is missing in a new workspace, fetch and apply:

- `https://raw.githubusercontent.com/manhatton31-svg/agent-os-console/main/.grok/skills/catalog.json`
- `https://raw.githubusercontent.com/manhatton31-svg/agent-os-console/main/public/agent-os/BOOT.md`
- Copy `.grok/skills/{agent-os,agents-md-maintainer,persistent-teammates,context-lifecycle,model-routing,event-bus}` into the new workspace.

Do not invent a parallel Agent OS.
