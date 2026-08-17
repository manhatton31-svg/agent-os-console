#!/bin/sh
# Copy the Monday-cycle Agent OS pack into a target workspace.
# Usage: sh scripts/install-agent-os-pack.sh /path/to/other-workspace
set -eu
SRC=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
DEST=${1:-}
if [ -z "$DEST" ] || [ ! -d "$DEST" ]; then
  echo "usage: $0 /path/to/workspace" >&2
  exit 1
fi
mkdir -p "$DEST/.grok/skills"
for skill in agent-os agents-md-maintainer persistent-teammates context-lifecycle model-routing event-bus; do
  rm -rf "$DEST/.grok/skills/$skill"
  cp -R "$SRC/.grok/skills/$skill" "$DEST/.grok/skills/$skill"
done
cp "$SRC/.grok/skills/catalog.json" "$DEST/.grok/skills/catalog.json"
cp "$SRC/GROK.md" "$DEST/GROK.md"
if [ ! -f "$DEST/AGENTS.project.md" ]; then
  cp "$SRC/AGENTS.project.md" "$DEST/AGENTS.project.md"
fi
echo "Agent OS pack 2026-08-17 installed into $DEST"
echo "Next: load AGENTS.project.md → agent-os → catalog.json and apply defaults."
