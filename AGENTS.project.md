# Agent OS Console

## Load first
- `GROK.md`
- `.grok/skills/agent-os/SKILL.md`

## Stack
TanStack Start, React 19, Tailwind v4, Zustand, Postgres/PGLite

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Types: `npm run typecheck`

## Conventions
- AGENTS.md = place (this file). Skills = how.
- Scope DB writes by `user_id` via `authMiddleware`.
- Tokens in `src/styles.css` `@theme`. No ad-hoc hex.

## Constraints
- Preview on `0.0.0.0:8080`.
- Auth: Google + X via Grok broker.
- Compact agent loops at 48k (before 200k price band).
- Plan/verify: grok-4.6. Execute: cheaper model.

## Skills
- `.grok/skills/agent-os/SKILL.md`
- `.grok/skills/agents-md-maintainer/SKILL.md`
- `.grok/skills/persistent-teammates/SKILL.md`
- `.grok/skills/context-lifecycle/SKILL.md`
- `.grok/skills/model-routing/SKILL.md`
- `.grok/skills/event-bus/SKILL.md`
