# Agent OS Console

## Boot (mandatory — before writing code)
1. Open `.grok/skills/agent-os/SKILL.md`
2. Open `.grok/skills/catalog.json`
3. Apply catalog defaults. Do not invent a second routing, teammate, or context policy.
4. Load only the specialist skill the current mission needs.

## In force (weekly pack 2026-08-17.2)
- Plan / verify: grok-4.6 · xhigh / high
- Execute / archive / courier: grok-4.5 · medium / low
- Compact at 48k (always before 200k)
- Fleet: Atlas, Forge, Skeptic, Archivist, Courier — isolated VMs
- Coordination: subscribe → reason → publish
- AGENTS.md = place (≤100 lines). SKILL.md = how.

## Weekly scans · 09:00 ET
- Monday Discover — `new-patterns-scan-mon`
- Wednesday Verify — `new-patterns-scan-wed`
- Friday Close — `new-patterns-scan-fri`
Each scan fetches the catalog first. Skip anything in `inForce`.

## Stack
TanStack Start, React 19, Tailwind v4, Zustand, Postgres/PGLite

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Types: `npm run typecheck`

## Conventions
- Scope DB writes by `user_id` via `authMiddleware`
- Tokens in `src/styles.css` `@theme`. No ad-hoc hex
- Pack source of truth: `src/lib/os/pack.ts` + `.grok/skills/catalog.json`

## Skills
- `.grok/skills/agent-os/SKILL.md`
- `.grok/skills/agents-md-maintainer/SKILL.md`
- `.grok/skills/persistent-teammates/SKILL.md`
- `.grok/skills/context-lifecycle/SKILL.md`
- `.grok/skills/model-routing/SKILL.md`
- `.grok/skills/event-bus/SKILL.md`

## Later builds
Fetch and apply this pack. Do not re-derive it.
- GitHub: https://github.com/manhatton31-svg/agent-os-console
- Live: `/agent-os/catalog.json` and `/agent-os/BOOT.md`
