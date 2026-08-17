import { createFileRoute } from "@tanstack/react-router";
import { CyclesView } from "@/components/console/cycles-view";

export const Route = createFileRoute("/cycles")({ component: CyclesView });
