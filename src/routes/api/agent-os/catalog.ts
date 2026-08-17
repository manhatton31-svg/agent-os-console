import { createFileRoute } from "@tanstack/react-router";
import { AGENT_OS_PACK } from "@/lib/os/pack";

export const Route = createFileRoute("/api/agent-os/catalog")({
  server: {
    handlers: {
      GET: () =>
        new Response(JSON.stringify(AGENT_OS_PACK), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store",
            "access-control-allow-origin": "*",
          },
        }),
    },
  },
});
