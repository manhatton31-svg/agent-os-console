import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Sparkles, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { polishAgentsMd } from "@/lib/os/server";
import { lineCount, renderAgentsMd, specHealth } from "@/lib/os/spec";
import { useOs } from "@/lib/os/store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function SpecView() {
  const spec = useOs((s) => s.spec);
  const setSpec = useOs((s) => s.setSpec);
  const { user } = useCurrentUserState();
  const [skillDraft, setSkillDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [polished, setPolished] = useState<string | null>(null);

  const md = useMemo(() => renderAgentsMd(spec), [spec]);
  const health = specHealth(md);

  async function polish() {
    if (!user) {
      toast.message("Sign in to run the grok-4.6 tightener");
      return;
    }
    setBusy(true);
    try {
      const res = await polishAgentsMd({ data: { markdown: md } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setPolished(res.text);
      toast.success("Tightened. Review before replacing the generator output.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section>
        <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Project context</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">AGENTS.md maintainer</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Project facts live here. Task knowledge lives in skills. Keep this
          file under 100 lines — agents degrade when you paste SOPs into the
          root spec.
        </p>

        <div className="mt-5 grid gap-3">
          {(
            [
              ["project", "Project"],
              ["stack", "Stack"],
              ["build", "Build command"],
              ["test", "Test command"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="grid gap-1.5">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                value={spec[key]}
                onChange={(e) => setSpec({ ...spec, [key]: e.target.value })}
              />
            </div>
          ))}
          <div className="grid gap-1.5">
            <Label htmlFor="conv">Conventions</Label>
            <Textarea
              id="conv"
              value={spec.conventions}
              onChange={(e) => setSpec({ ...spec, conventions: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cst">Constraints</Label>
            <Textarea
              id="cst"
              value={spec.constraints}
              onChange={(e) => setSpec({ ...spec, constraints: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sk">Add skill (task knowledge)</Label>
            <div className="flex gap-2">
              <Input
                id="sk"
                value={skillDraft}
                onChange={(e) => setSkillDraft(e.target.value)}
                placeholder="context-lifecycle"
              />
              <Button
                variant="secondary"
                onClick={() => {
                  const s = skillDraft.trim();
                  if (!s) return;
                  setSpec({ ...spec, skills: [...spec.skills, s] });
                  setSkillDraft("");
                }}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {spec.skills.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="rounded-full border border-line bg-raised px-3 py-1 text-xs text-muted hover:text-fg"
                  onClick={() =>
                    setSpec({ ...spec, skills: spec.skills.filter((x) => x !== s) })
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge tone={health.tone}>{health.label}</Badge>
            <span className="font-mono text-xs text-muted">{health.lines} lines</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                void navigator.clipboard.writeText(md);
                toast.success("Copied AGENTS.md");
              }}
            >
              <Copy className="size-3.5" />
              Copy
            </Button>
            <Button size="sm" onClick={() => void polish()} disabled={busy}>
              <Sparkles className="size-3.5" />
              Tighten
            </Button>
          </div>
        </div>
        <pre className="mt-4 max-h-[28rem] overflow-auto rounded-lg bg-bg p-4 font-mono text-xs leading-relaxed text-muted">
          {md}
        </pre>
        {polished ? (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.14em] text-faint">
              grok-4.6 pass · {lineCount(polished)} lines
            </p>
            <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-bg p-4 font-mono text-xs leading-relaxed text-muted">
              {polished}
            </pre>
          </div>
        ) : null}
      </section>
    </div>
  );
}
