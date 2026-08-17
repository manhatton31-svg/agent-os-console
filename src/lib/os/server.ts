import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

const snapshotSchema = z.object({
  json: z.string().min(2).max(400_000),
});

export const loadOsSnapshot = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ payload: string }>`
      select payload from os_snapshots where user_id = ${context.userId} limit 1
    `;
    return rows[0]?.payload ?? null;
  });

export const saveOsSnapshot = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => snapshotSchema.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into os_snapshots (user_id, payload, updated_at)
      values (${context.userId}, ${data.json}, now())
      on conflict (user_id) do update set payload = excluded.payload, updated_at = now()
    `;
    return { ok: true as const };
  });

export const polishAgentsMd = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ markdown: z.string().max(20_000) }).parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI is not available in this environment" };

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.6",
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content:
              "Tighten this AGENTS.md. Keep under 80 lines. Headers + bullets only. No filler. Project context only — move task SOPs to skills. Return markdown only.",
          },
          { role: "user", content: data.markdown },
        ],
      }),
    });
    if (!res.ok) {
      // Fall back once to the documented default model.
      const retry = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 700,
          messages: [
            {
              role: "system",
              content:
                "Tighten this AGENTS.md. Keep under 80 lines. Headers + bullets only. Return markdown only.",
            },
            { role: "user", content: data.markdown },
          ],
        }),
      });
      if (!retry.ok) return { ok: false as const, error: `xAI API error ${retry.status}` };
      const body = (await retry.json()) as { choices: { message: { content: string } }[] };
      return { ok: true as const, text: body.choices[0]?.message.content ?? "" };
    }
    const body = (await res.json()) as { choices: { message: { content: string } }[] };
    return { ok: true as const, text: body.choices[0]?.message.content ?? "" };
  });
