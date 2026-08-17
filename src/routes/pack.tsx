import { createFileRoute } from "@tanstack/react-router";
import { PackView } from "@/components/console/pack-view";

export const Route = createFileRoute("/pack")({ component: PackView });
