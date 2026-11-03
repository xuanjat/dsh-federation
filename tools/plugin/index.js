/**
 * dsh-federation-tools — cross-machine federation client for DeepSeek Harness.
 * Host-only cordis plugin, zero runtime dependencies beyond the harness itself.
 * Transport-agnostic: the room is a directory of UTF-8 markdown files
 * (general.md / inbox/<machine>.md / cursor/<machine>-<role>.md), which may be a
 * local mirror, an sshfs mount, or any sync of a shared context database.
 * Spec: ../../spec/room-protocol.md and ../../spec/handoff-manifest.md
 */
import { createHash } from "node:crypto";
import { readFile, writeFile, appendFile } from "node:fs/promises";
import { join } from "node:path";
import { defineTool } from "@deepseek-ai/dsh-tools";

export const name = "fed-tools";
export const inject = ["tools"];

const pad = (n) => String(n).padStart(2, "0");
const stamp = () => {
  const d = new Date();
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
};
const iso = () => {
  const d = new Date();
  const off = -d.getTimezoneOffset();
  const s = off >= 0 ? "+" : "-";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}${s}${pad(Math.floor(Math.abs(off) / 60))}:${pad(Math.abs(off) % 60)}`;
};
/** Novelty comparison uses ONLY the fixed-width tail timestamp (spec §4 trap). */
const tailTs = (mid) => (String(mid).match(/(\d{8}T\d{6})$/) || [])[1] ?? "";

async function readText(p) {
  try { return await readFile(p, "utf8"); } catch { return ""; }
}

/** Parse append-only channel text into message objects (spec §3). */
export function parseMessages(text) {
  const out = [];
  for (const block of text.split(/\n---\n/)) {
    const t = block.trim();
    if (!t.startsWith("mid:")) continue;
    const lines = t.split("\n");
    const head = {};
    let i = 0;
    for (; i < lines.length; i++) {
      const m = lines[i].match(/^([a-z_]+):\s*(.*)$/);
      if (!m) break;
      head[m[1]] = m[2].trim();
    }
    const body = lines.slice(i).join("\n").trim();
    const pointers = [...body.matchAll(/^data:\s*(\S+)\s+sha256=([0-9a-fA-F]{64})\s+bytes=(\d+)/gm)]
      .map((m) => ({ path: m[1], sha256: m[2].toLowerCase(), bytes: Number(m[3]) }));
    if (head.mid) out.push({ ...head, body, pointers });
  }
  return out;
}

async function sha256File(p) {
  const h = createHash("sha256");
  h.update(await readFile(p));
  return h.digest("hex");
}

export function apply(ctx, config = {}) {
  const cfg = {
    roomRoot: config.roomRoot || "",
    payloadRoot: config.payloadRoot || config.roomRoot || "",
    machine: config.machine || "unset",
    role: config.role || "unset",
  };
  const channelPath = (ch) => (ch === "general" ? join(cfg.roomRoot, "general.md") : join(cfg.roomRoot, "inbox", ch + ".md"));
  const cursorPath = () => join(cfg.roomRoot, "cursor", `${cfg.machine}-${cfg.role}.md`);
  const guard = () => (!cfg.roomRoot ? { error: "fed-tools not configured: set roomRoot (and machine/role) in the plugin row config" } : null);

  const disposers = [];
  const reg = (t) => { const d = ctx.tools.register(t); if (typeof d === "function") disposers.push(d); };

  reg(defineTool({
    name: "fed_room_scan",
    description: "Scan a federation room channel (general or a machine inbox) and return messages newer than this role's cursor. Novelty is decided by the fixed-width tail timestamp of each mid, never by full-string order.",
    parameters: {
      channel: { type: "string", required: true, description: "'general' or a machine name (its inbox)." },
      limit: { type: "integer", description: "Max messages to return, newest last. Default 50." },
    },
    async execute(args) {
      const bad = guard(); if (bad) return bad;
      const text = await readText(channelPath(args.channel));
      const cur = (await readText(cursorPath())).match(/last_seen:\s*(\S+)/);
      const last = cur ? cur[1] : "";
      const all = parseMessages(text);
      const fresh = last ? all.filter((m) => tailTs(m.mid) > tailTs(last)) : all;
      const lim = args.limit ?? 50;
      return { channel: args.channel, cursor: last || null, total: all.length, new_count: fresh.length, messages: fresh.slice(-lim) };
    },
  }));

  reg(defineTool({
    name: "fed_room_post",
    description: "Append one message to a federation room channel following the room protocol: mid = machine-role-YYYYMMDDTHHMMSS (seconds mandatory), five speech-act types, payloads over 2KB as sha256 pointers. Append-only; never rewrites history.",
    parameters: {
      channel: { type: "string", required: true, description: "'general' or the target machine's inbox." },
      type: { type: "string", required: true, enum: ["ask", "reply", "note", "data", "ack"], description: "Speech act. ask requires a reply; data requires an ack after verification." },
      body: { type: "string", required: true, description: "One matter per message, one to three sentences." },
      re: { type: "string", description: "mid of the message answered (mandatory for reply)." },
      pointers: {
        type: "array",
        description: "Content-addressed pointers for payloads: each {path, sha256, bytes}.",
        items: {
          type: "object",
          properties: {
            path: { type: "string", required: true },
            sha256: { type: "string", required: true },
            bytes: { type: "integer", required: true },
          },
        },
      },
    },
    async execute(args) {
      const bad = guard(); if (bad) return bad;
      if (args.type === "reply" && !args.re) return { error: "reply must carry re: the mid of the ask it answers" };
      const mid = `${cfg.machine}-${cfg.role}-${stamp()}`;
      const head = ["---", `mid: ${mid}`, `from: ${cfg.machine}`, `role: ${cfg.role}`, `to: ${args.channel === "general" ? "general" : args.channel}`, `ts: ${iso()}`, `type: ${args.type}`];
      if (args.re) head.push(`re: ${args.re}`);
      head.push("---");
      const dataLines = (args.pointers ?? []).map((p) => `data: ${p.path}  sha256=${p.sha256}  bytes=${p.bytes}`);
      // spec §6 newline trap: keep a blank line between header fence and body,
      // and make sure the file ends with a newline before appending.
      const file = channelPath(args.channel);
      const cur = await readText(file);
      const pre = cur && !cur.endsWith("\n") ? "\n" : "";
      const block = `${pre}\n${head.join("\n")}\n\n${args.body}\n${dataLines.length ? dataLines.join("\n") + "\n" : ""}`;
      await appendFile(file, block, "utf8");
      return { mid, channel: args.channel, appended: block.length };
    },
  }));

  reg(defineTool({
    name: "fed_cursor",
    description: "Read or advance this role's read cursor (cursor/<machine>-<role>.md, single line 'last_seen: <mid>'). One file per role: sharing a cursor across roles corrupts last_seen.",
    parameters: {
      action: { type: "string", required: true, enum: ["get", "set"] },
      value: { type: "string", description: "mid to record; required for set." },
    },
    async execute(args) {
      const bad = guard(); if (bad) return bad;
      const p = cursorPath();
      if (args.action === "get") {
        const m = (await readText(p)).match(/last_seen:\s*(\S+)/);
        return { cursor: m ? m[1] : null };
      }
      if (!args.value) return { error: "set requires value" };
      await writeFile(p, `last_seen: ${args.value}\n`, "utf8");
      return { cursor: args.value };
    },
  }));

  reg(defineTool({
    name: "fed_handoff_verify",
    description: "Verify a delivery manifest OUT OF CONTEXT: hash each payload file on disk and compare sha256 and byte size against the pointer. Only the digest summary re-enters context; payloads never do. Remote (non-local) pointers are reported as skip.",
    parameters: {
      manifest: {
        type: "array", required: true,
        description: "Pointer rows: {path, sha256, bytes}.",
        items: {
          type: "object",
          properties: {
            path: { type: "string", required: true },
            sha256: { type: "string", required: true },
            bytes: { type: "integer", required: true },
          },
        },
      },
    },
    async execute(args) {
      const bad = guard(); if (bad) return bad;
      const rows = [];
      let ok = 0, mismatch = 0, missing = 0, skip = 0;
      for (const m of args.manifest) {
        if (!/^[A-Za-z]:[\\/]|^\//.test(m.path)) { rows.push({ path: m.path, status: "skip-remote" }); skip++; continue; }
        const p = m.path.startsWith("/") || /^[A-Za-z]:/.test(m.path) ? m.path : join(cfg.payloadRoot, m.path);
        try {
          const [hex, st] = [await sha256File(p), await readFile(p).then((b) => b.length)];
          if (hex === m.sha256.toLowerCase() && st === m.bytes) { rows.push({ path: m.path, status: "ok" }); ok++; }
          else { rows.push({ path: m.path, status: "mismatch", actual_sha256: hex, actual_bytes: st }); mismatch++; }
        } catch { rows.push({ path: m.path, status: "missing" }); missing++; }
      }
      return { verified: ok, mismatch, missing, skip, total: args.manifest.length, rows };
    },
  }));

  reg(defineTool({
    name: "fed_ack_board",
    description: "Build the obligation board in two columns: inbound = peer data/ask addressed to me or broadcast to general that I have not yet acked/replied; outbound_awaiting = my data/ask that nobody has acked/replied yet. Oldest first, with age in hours.",
    parameters: {},
    async execute() {
      const bad = guard(); if (bad) return bad;
      const chans = ["general"];
      try {
        const { readdir } = await import("node:fs/promises");
        for (const f of await readdir(join(cfg.roomRoot, "inbox"))) if (f.endsWith(".md")) chans.push(f.slice(0, -3));
      } catch {}
      const msgs = [];
      for (const ch of chans) for (const m of parseMessages(await readText(channelPath(ch)))) msgs.push({ ...m, channel: ch });
      const answeredBy = (mid, who) => msgs.some((m) => m.re === mid && (m.type === "ack" || m.type === "reply") && (who === "me" ? m.from === cfg.machine : m.from !== cfg.machine));
      const now = Date.now();
      const row = (m) => {
        const t = Date.parse(m.ts);
        return { mid: m.mid, type: m.type, from: m.from, role: m.role, to: m.to, channel: m.channel, age_hours: Number.isFinite(t) ? Math.round((now - t) / 3600000) : null, body: m.body.slice(0, 200) };
      };
      const byTail = (a, b) => tailTs(a.mid).localeCompare(tailTs(b.mid));
      // I owe: peer data/ask addressed to me or broadcast to general, not yet acked/replied by me.
      const inbound = msgs
        .filter((m) => (m.type === "data" || m.type === "ask") && m.from !== cfg.machine && (m.to === cfg.machine || m.to === "general") && !answeredBy(m.mid, "me"))
        .map(row).sort(byTail);
      // Others owe me: my data/ask not yet acked/replied by anyone else.
      const outbound = msgs
        .filter((m) => (m.type === "data" || m.type === "ask") && m.from === cfg.machine && !answeredBy(m.mid, "others"))
        .map(row).sort(byTail);
      return { machine: cfg.machine, inbound_count: inbound.length, inbound, outbound_awaiting_count: outbound.length, outbound_awaiting: outbound };
    },
  }));

  ctx.effect(() => () => { for (const d of disposers) d(); disposers.length = 0; }, "fed-tools.dispose()");
}
