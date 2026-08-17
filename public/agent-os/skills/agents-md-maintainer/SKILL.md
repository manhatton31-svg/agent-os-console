---
name: agents-md-maintainer
description: >
  Create and keep AGENTS.md / AGENTS.project.md under 100 lines. Project
  context only; task knowledge belongs in SKILL.md. Triggers on "AGENTS.md",
  "project spec", "agent readme", "tighten spec", "CLAUDE.md", "conventions".
metadata:
  short-description: "Project-level AGENTS.md: short, facts only, pointers to skills"
  version: "2026-08-17"
user-invocable: true
---

# AGENTS.md maintainer

Complementary to Agent Skills: **this file is the place; skills are the how.**

## Belongs in AGENTS.md
- Stack
- Install / build / test commands
- Hard conventions and constraints
- Pointers to `.grok/skills/*/SKILL.md`

## Does not belong
- Task playbooks, email copy, ranking rules, long SOPs
- Those go in a skill folder with `SKILL.md` + optional `references/`

## Rules
- Headers + bullets. No filler paragraphs.
- Target ≤ 60 lines. Never exceed 100.
- Reference existing docs; do not embed them.
- One file at repo root (`AGENTS.md` or `AGENTS.project.md` in App Builder).

## Generate
Use the Agent OS Console spec view, or write from the template in `references/template.md`.
