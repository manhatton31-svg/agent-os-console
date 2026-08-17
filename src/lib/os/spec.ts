import type { SpecDoc } from "./types";

export const DEFAULT_SPEC: SpecDoc = {
  project: "Agent OS Console",
  stack: "TanStack Start, React 19, Tailwind v4, Postgres/PGLite",
  build: "npm run build",
  test: "npm run typecheck",
  conventions:
    "Keep AGENTS.md under 100 lines. Project facts here; task knowledge in skills/. Scope DB writes by user_id. Tokens in CSS, no ad-hoc hex.",
  constraints:
    "Preview binds 0.0.0.0:8080. Auth via Grok broker (Google, X). No secrets in client. Compaction before 200k prompt tokens.",
  skills: [
    "agents-md-maintainer",
    "persistent-teammates",
    "context-lifecycle",
    "model-routing",
  ],
};

export function renderAgentsMd(spec: SpecDoc): string {
  const skills = spec.skills
    .map((s) => `- \`.grok/skills/${s}/SKILL.md\` — task knowledge, load on demand`)
    .join("\n");

  return `# ${spec.project}

## Stack
${spec.stack}

## Commands
- Build: \`${spec.build}\`
- Test: \`${spec.test}\`

## Conventions
${spec.conventions}

## Constraints
${spec.constraints}

## Skills (task knowledge — not project context)
${skills || "- (none yet)"}

## Notes
- This file is project-scoped. Do not paste SOPs here.
- Skills use SKILL.md + progressive disclosure.
- Prefer recency prune + summary over full history.
`;
}

export function lineCount(md: string) {
  return md.split("\n").length;
}

export function specHealth(md: string) {
  const lines = lineCount(md);
  if (lines <= 60) return { lines, tone: "ok" as const, label: "Tight" };
  if (lines <= 100) return { lines, tone: "warn" as const, label: "Near budget" };
  return { lines, tone: "bad" as const, label: "Too long — split into skills" };
}
