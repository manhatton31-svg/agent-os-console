import { createFileRoute } from "@tanstack/react-router";
import { SpecView } from "@/components/console/spec-view";

export const Route = createFileRoute("/spec")({ component: SpecView });
