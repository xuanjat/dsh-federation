#!/usr/bin/env node
// Murmuration single-box demo: one store, two roles, a full pointer-delivery
// round visible as a transcript. Runs in ~5 seconds on Node >= 18, touches
// only a temp directory, and needs no DSH install.
//   node tools/demo/demo.mjs
import { pathToFileURL } from "node:url";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";

const TMP = mkdtempSync(join(tmpdir(), "murmuration-demo-"));
const room = join(TMP, "room");
const plugin = join(TMP, "plugincopy");
mkdirSync(join(room, "cursor"), { recursive: true });
mkdirSync(join(room, "inbox"), { recursive: true });
mkdirSync(plugin, { recursive: true });
mkdirSync(join(TMP, "node_modules", "@deepseek-ai", "dsh-tools"), { recursive: true });
writeFileSync(join(TMP, "node_modules", "@deepseek-ai", "dsh-tools", "index.js"), "export const defineTool = (t) => t;\n");
writeFileSync(join(plugin, "index.js"), readFileSync(new URL("../plugin/index.js", import.meta.url)));

const pad = (n) => String(n).padStart(2, "0");
const st = (d) => d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
const iso = (d) => d.toISOString();

// --- constitution: the shortest room that still obeys the protocol ----------
const constitutionMid = "lark-diplomat-" + st(new Date());
const constitution = [
  "# demo room — append-only", "",
  "mid: " + constitutionMid, "from: lark", "role: diplomat", "to: general", "ts: " + iso(new Date()), "type: note", "---", "",
  "Constitution: mid is the sole ordering authority (seconds mandatory); append-only; one cursor per (machine,role); novelty = fixed-width tail compare; bodies >2KB become data pointers; no payloads/secrets in the store; ack every inbound data/ask within 48h.", ""
].join("\n");
writeFileSync(join(room, "general.md"), constitution + "\n");
writeFileSync(join(room, "cursor", "finch-diplomat.md"), "last_seen: " + constitutionMid + "\n");

const reg = [];
const ctx = (machine, role) => ({ tools: { register: (t) => { reg.push([machine, role, t]); return () => {}; } }, effect: (fn) => { fn(); } });
const { apply } = await import(pathToFileURL(join(plugin, "index.js")).href);
apply(ctx("lark", "diplomat"), { roomRoot: room, machine: "lark", role: "diplomat" });
apply(ctx("finch", "diplomat"), { roomRoot: room, machine: "finch", role: "diplomat" });
const toolsOf = (m, r) => Object.fromEntries(reg.filter(([mm, rr]) => mm === m && rr === r).map(([, , t]) => [t.name, t]));
const lark = toolsOf("lark", "diplomat"), finch = toolsOf("finch", "diplomat");

const say = (s) => console.log(s);
say("Murmuration single-box demo — store: " + room);
say("roles: lark/diplomat (producer)  finch/diplomat (consumer)\n");
// one-beat pause so the data message lands in a LATER second than the cursor
// (same-second ids are equal by design: the tail order is total only across seconds)
await new Promise((r) => setTimeout(r, 1100));

// STEP 1 - producer writes payload to local disk; builds manifest
const payload = join(TMP, "payloads", "field-report.md");
mkdirSync(join(TMP, "payloads"), { recursive: true });
const bytes = Buffer.from("# field report (demo payload)\nThis file never enters the room.\n");
writeFileSync(payload, bytes);
const sha = createHash("sha256").update(bytes).digest("hex");
const n = statSync(payload).size;
say("[1] lark writes payload " + payload + " (" + n + "B, sha256=" + sha.slice(0, 16) + "...) - payload stays OUT of the store");

// STEP 2 - producer appends a data message: pointer + manifest only
const p1 = await lark.fed_room_post.execute({ channel: "finch", type: "data", body: "field report ready\ndata: " + payload + "  sha256=" + sha + "  bytes=" + n });
say("[2] lark posts data message " + p1.mid + " (pointer only)");

// STEP 3 - consumer watch turn: scan detects unseen mid
const scan = await finch.fed_room_scan.execute({ channel: "general" });
const seen = await finch.fed_trigger_watch.execute({ channels: ["general", "finch"] });
say("[3] finch watch turn: trigger candidates=" + seen.candidate_count + " reasons=" + JSON.stringify(seen.candidates.map((c) => c.reasons)));

// STEP 4 - consumer fetches payload over its own channel (simulated: same disk)
say("[4] finch fetches payload over pre-existing channel (scp/rsync/sshfs in real fleets)");

// STEP 5 - verify digest OUT OF CONTEXT
const v = await finch.fed_handoff_verify.execute({ manifest: [{ path: payload, sha256: sha, bytes: n }] });
const okj = JSON.stringify(v);
say("[5] finch verifies: " + okj.slice(0, 140));

// STEP 6 - ack discharges the obligation; board clears; cursors advance
const a1 = await finch.fed_room_post.execute({ channel: "lark", type: "ack", re: p1.mid, body: "digest+bytes verified, delivery accepted" });
await finch.fed_trigger_watch.execute({ channels: ["general", "finch"], update_cursor: true });
const board = await finch.fed_ack_board.execute({});
const boardLark = await lark.fed_ack_board.execute({});
const inbound = board.inbound_count ?? board.inbound?.length;
const awaiting = boardLark.outbound_awaiting_count ?? boardLark.outbound_awaiting?.length;
say("[6] finch posts ack " + a1.mid + "; finch inbound uncleared=" + inbound + "; lark outbound awaiting=" + awaiting);
say("\ntranscript tail (general.md):");
say(readFileSync(join(room, "general.md"), "utf8").trimEnd().split("\n").slice(-8).join("\n"));
const pass = v.verified === 1 && v.mismatch === 0;
say("\nDEMO " + (pass ? "OK - obligation discharged, trail append-only" : "CHECK verifier output above"));
say("temp dir kept for inspection: " + TMP);
