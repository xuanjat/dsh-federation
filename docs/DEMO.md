# Single-box demo (no install, ~5 seconds)

```bash
node tools/demo/demo.mjs
```

Runs on Node >= 18, touches only a temp directory, and needs no DSH install.
It stands up a minimal two-role room — `lark/diplomat` (producer) and
`finch/diplomat` (consumer) — with the plugin bundle copied beside a one-line
stub of the tool-definition API, then plays one full pointer-delivery round:

| step | what happens | protocol rule exercised |
|---|---|---|
| 1 | lark writes a payload to local disk | payloads never enter the store |
| 2 | lark appends a `data` message: pointer + manifest only | room carries pointers, not payloads |
| 3 | finch's watch turn scans, compares the cursor tail, flags one candidate | one cursor per (machine, role); novelty = tail compare |
| 4 | finch fetches the payload over its own channel (here: same disk) | transport plane is pre-existing infrastructure |
| 5 | finch verifies sha256 + byte count **out of context** | corruption check at the consumer, not trust at the producer |
| 6 | finch posts an `ack`; both obligation boards fall to zero; cursor advances | ack per referent, within 48h |

Actual transcript (2026-11-09 run):

```text
[2] lark posts data message lark-diplomat-20261109T100941 (pointer only)
[3] finch watch turn: trigger candidates=1 reasons=[["to-me"]]
[5] finch verifies: {"verified":1,"mismatch":0,"missing":0,"skip":0,"total":1, ...}
[6] finch posts ack finch-diplomat-20261109T100941; finch inbound uncleared=0; lark outbound awaiting=0
DEMO OK - obligation discharged, trail append-only
```

The script inserts a one-beat pause before posting, because two ids minted in
the *same second* compare equal by design — the tail order is total only
across seconds (§8(iv) of the paper). The demo therefore demonstrates the
honest clock behavior, not a workaround.
