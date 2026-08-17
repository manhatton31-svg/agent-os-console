import type { MissionStatus, TeammateStatus } from "@/lib/os/types";

export function statusTone(status: TeammateStatus | MissionStatus) {
  if (status === "running" || status === "verifying") return "ok" as const;
  if (status === "blocked" || status === "failed") return "bad" as const;
  if (status === "handoff" || status === "complete") return "warn" as const;
  return "neutral" as const;
}
