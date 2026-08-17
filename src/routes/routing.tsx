import { createFileRoute } from "@tanstack/react-router";
import { RoutingView } from "@/components/console/routing-view";

export const Route = createFileRoute("/routing")({ component: RoutingView });
