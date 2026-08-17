import { createFileRoute } from "@tanstack/react-router";
import { MissionView } from "@/components/console/mission-view";

export const Route = createFileRoute("/")({ component: MissionView });
