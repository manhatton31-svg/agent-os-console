---
name: model-routing
description: >
  Route expensive reasoning to grok-4.6 xhigh and cheap execution to a faster
  model. Triggers on "model routing", "xhigh", "grok-4.6", "plan vs exec",
  "reasoning effort", "cost".
metadata:
  short-description: "Plan on grok-4.6 xhigh; execute cheaper; compact before 200k"
  version: "2026-08-17"
user-invocable: true
---

# Model routing

## Default policy
| Lane | Model | Effort |
|---|---|---|
| Plan / decompose / long-horizon | grok-4.6 | xhigh |
| Verify / skeptic | grok-4.6 | high |
| Execute / implement | grok-4.5 | medium |
| Archive / courier | grok-4.5 | low |

## Cost cliff
Prompts ≥ 200k tokens double input/output price on Grok 4.6. Compact at 48k by default (`context-lifecycle`).

## Rules
- Never run implementor slices at xhigh.
- Never plan a multi-step mission at low.
- Self-check (skeptic) after implementor, in a quarantined thread.
