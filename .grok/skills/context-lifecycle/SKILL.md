---
name: context-lifecycle
description: >
  Context engineering as lifecycle management: admit, place, compact, recover,
  reuse, govern. Mitigate context rot. Triggers on "context", "compact",
  "context rot", "summarize history", "quarantine", "token budget".
metadata:
  short-description: "Admit/place/compact/recover/reuse/govern the context window"
  version: "2026-08-17"
user-invocable: true
---

# Context lifecycle

Not one-shot prompt shortening. Operate the window as an OS.

| Stage | Do |
|---|---|
| Admit | Only project AGENTS.md, the active goal, last tool window |
| Place | Gold facts at the edges; isolate sub-agent transcripts |
| Compact | Recency prune (last ~5 tool calls) + summary. Default at 48k. Always before 200k. |
| Recover | Pull from Archivist / fuel when a fact is needed again |
| Reuse | Skills and AGENTS.md as pointers, never pasted bodies |
| Govern | Cap budget, log rot, approval-gate kernel writes |

## Evidence
Recency + summarization beats full history on tool-heavy work (token and accuracy). Every frontier model still rots inside a large window.

## Pair with
`session-compactor` if present. `model-routing` for when to spend xhigh.
