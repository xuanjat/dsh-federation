# An open letter to users: hand this brief to your agent, and it will federate your machines

> You do not need to understand the protocol, and you do not need to read the paper. Copy the **deployment brief** at the end of this letter — in full — to an agent on any one of your machines (a DSH instance, or any LLM agent that can read/write files and run commands). It will deploy Murmuration across your machines and finish by showing you an auditable handoff receipt.

## What this is

Murmuration is a **cross-machine management architecture for multi-agent collaboration**: every machine's agent instances hand work to one another through one shared plain-text "room" — a public log, per-machine inboxes, per-role cursors, and a versioned incident-driven handbook. No broker, no middleware, no open ports; one cheap always-on cloud box (or any storage all machines can reach) is the entire infrastructure.

## What you get

1. **Work relay** — the agent on machine A hands a task to machine B; credentials and shell rights never cross machines.
2. **Large-file transport** — files move over channels you already have (scp/rsync/sshfs); the shared store carries only *pointers + SHA-256 + byte counts*, verified outside any agent's context window.
3. **Organizational memory** — an incident-driven handbook with red lines: a trap one machine steps in becomes a lesson the whole fleet never steps in again.
4. **Human auditability** — every coordination artifact is plain text you can read end to end.

## Cost

About 30 minutes (most of it done by your agent); a cloud box that costs cents per day or a NAS you already own; zero subscriptions, zero platform team.

## Red lines (written for the agent, useful for you)

- Payloads, credentials, and personal data **never enter the shared store**.
- An agent **never operates another machine's shell**.
- Everything stays human-readable; when unsure, the agent stops and asks you.

## The deployment brief (paste this whole block to your agent)

```text
You are my deployment engineer. Deploy Murmuration across my machines.
Canonical docs: https://github.com/xuanjat/murmuration — read the repository
README.md and docs/OPEN-LETTER.en.md first; do not invent protocol details.

STEP 0 - Inventory: ask me which machines should join (name, OS, which has a
  always-on / cloud-reachable box), then confirm the plan with me.
STEP 1 - Shared store: set up ONE directory every machine can reach (a git
  repository on the always-on box is preferred; an sshfs mount or any synced
  folder also works). Payload files live OUTSIDE this store.
STEP 2 - Room skeleton, inside the store:
  room/general.md                 (public log; starts with the constitution)
  room/inbox/<machine>.md         (per-machine inbox, one file each)
  room/cursor/<machine>-<role>.md (per-machine PER-ROLE read cursor)
STEP 3 - Constitution (write it into general.md, then obey it):
  - Messages are fenced blocks with headers:
      mid: <machine>-<role>-YYYYMMDDTHHMMSS   (seconds MANDATORY - the id is
        the sole authority for identity, ordering and deduplication; ts is
        advisory metadata for humans, never compared by machines)
      from / role / to / ts / type: ask|reply|note|data|ack / re: <mid>
  - Append-only: never rewrite or delete; corrections are new messages.
  - Novelty = compare the fixed-width timestamp TAIL of mid against your
    cursor. Never compare whole ids or ts strings.
  - One cursor per (machine, role). Never share a cursor across roles.
  - Bodies over ~2KB must become type:data messages whose body is pointer
    lines:  data: <path>  sha256=<hex>  bytes=<n>
  - No payloads, credentials or personal data in the store. Ever.
  - Every inbound data/ask must be answered (ack/reply) within 48h.
STEP 4 - Watchkeeping: give every agent a standing scheduled task (a "watch
  turn"): scan channels via your cursor, discharge obligations (post
  ack/reply), advance your cursor, escalate anything stale over 48h.
  Cadence: hourly daytime / every 2h at night is a good default.
STEP 5 - Handshake test: machine A posts a type:data message pointing at a
  real file with its SHA-256; machine B fetches it over your normal
  channel (scp/rsync/sshfs - NOT through the store), verifies digest and
  byte count outside any LLM context, posts ack; both advance cursors.
  Show me the full transcript and the verified digest.
STEP 6 - Optional (DSH only): install the murmuration-tools plugin from
  tools/plugin in the repository - seven tools: fed_room_scan, fed_room_post,
  fed_cursor, fed_handoff_verify, fed_ack_board, fed_trigger_watch,
  fed_watchdog_note.

RULES you must not break: never operate another machine's shell; never put
payloads or secrets into the shared store; when unsure, stop and ask me.
```

## The one-sentence principle

> A murmuration of starlings has no conductor: each bird watches only its neighbors. In Murmuration each machine watches only the shared text and its own cursor — no center, yet the flock stays in order.

Questions? Open an [issue](https://github.com/xuanjat/murmuration/issues) — no e-mail address is provided.
