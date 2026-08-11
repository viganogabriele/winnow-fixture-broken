import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { displayLabel } from "./format.ts";

const here = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT ?? 3000);

type Profile = { name?: string; surname?: string };

/**
 * Formats a display name from a profile.
 *
 * NOTE: `surname` is optional in the payload, so it is defaulted here.
 * Removing that default is one of the planted defects on the `planted-bugs`
 * branch — see README.
 */
function displayName(body: Profile): string {
  const { name = "", surname = "" } = body;
  const full = `${name.trim()} ${surname.trim()}`.trim();
  return full || "anonymous";
}

async function readJson(
  stream: AsyncIterable<Buffer>,
): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${port}`);

  if (url.pathname === "/api/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (url.pathname === "/api/profile" && req.method === "PATCH") {
    try {
      const body = (await readJson(req)) as Profile;
      const display = displayName(body);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          display,
          label: displayLabel(body.name ?? "", body.surname ?? ""),
        }),
      );
    } catch (error) {
      // A malformed body is the client's problem, not a server fault.
      if (error instanceof SyntaxError) {
        res.writeHead(422, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "invalid JSON" }));
        return;
      }
      throw error;
    }
    return;
  }

  if (url.pathname === "/" || url.pathname === "/index.html") {
    const html = await readFile(join(here, "..", "public", "index.html"));
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(html);
    return;
  }

  res.writeHead(404, { "content-type": "text/plain" });
  res.end("not found");
});

server.listen(port, () => {
  console.log(`fixture listening on http://localhost:${port}`);
});
