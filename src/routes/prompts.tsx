import { createFileRoute } from "@tanstack/react-router";
import { PromptsView } from "@/components/console/prompts-view";

export const Route = createFileRoute("/prompts")({ component: PromptsView });
