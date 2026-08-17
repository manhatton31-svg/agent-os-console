import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadOsSnapshot, saveOsSnapshot } from "@/lib/os/server";
import { useOs } from "@/lib/os/store";
import type { OsSnapshot } from "@/lib/os/types";

export function PersistBridge() {
  const { user, isPending } = useCurrentUserState();
  const hydrated = useRef(false);
  const last = useRef("");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (isPending || !user || hydrated.current) return;
    hydrated.current = true;
    void loadOsSnapshot()
      .then((raw) => {
        if (!raw) return;
        try {
          const snap = JSON.parse(raw) as OsSnapshot;
          if (snap.version === 1) useOs.getState().hydrate(snap);
        } catch {
          /* ignore corrupt */
        }
      })
      .catch(() => {
        /* first run */
      });
  }, [user, isPending]);

  useEffect(() => {
    if (!user) return;
    const unsub = useOs.subscribe((state) => {
      const payload: OsSnapshot = {
        version: 1,
        teammates: state.teammates,
        events: state.events.slice(0, 40),
        mission: state.mission,
        spec: state.spec,
        routing: state.routing,
        context: state.context,
      };
      const json = JSON.stringify(payload);
      if (json === last.current) return;
      last.current = json;
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        void saveOsSnapshot({ data: { json } }).catch(() => {
          toast.error("Could not persist to account");
        });
      }, 800);
    });
    return () => {
      unsub();
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [user]);

  return null;
}
