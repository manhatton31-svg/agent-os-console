import { createFileRoute } from "@tanstack/react-router";
import { EventsView } from "@/components/console/events-view";

export const Route = createFileRoute("/events")({ component: EventsView });
