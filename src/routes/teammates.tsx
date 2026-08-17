import { createFileRoute } from "@tanstack/react-router";
import { TeammatesView } from "@/components/console/teammates-view";

export const Route = createFileRoute("/teammates")({ component: TeammatesView });
