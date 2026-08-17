import { createFileRoute } from "@tanstack/react-router";
import { ContextView } from "@/components/console/context-view";

export const Route = createFileRoute("/context")({ component: ContextView });
