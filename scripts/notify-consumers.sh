#!/bin/sh
# After a pack bump, ping required consumers so they pull immediately.
# Needs CONSUMER_DISPATCH_TOKEN (classic PAT with repo scope on each consumer).
# Without it, consumers still pull on their hourly Action.
set -eu

if [ -z "${CONSUMER_DISPATCH_TOKEN:-}" ]; then
  echo "CONSUMER_DISPATCH_TOKEN unset — consumers will pull on their next hourly sync."
  exit 0
fi

GH_TOKEN=$CONSUMER_DISPATCH_TOKEN
export GH_TOKEN

gh api --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/manhatton31-svg/arcly-v2/dispatches \
  -f event_type='agent-os-pack-updated'

echo "Dispatched agent-os-pack-updated → manhatton31-svg/arcly-v2"
