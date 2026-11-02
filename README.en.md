# dsh-federation

> **A method framework for federating multiple DSH agent instances across machines**
> Cross-machine collaboration built entirely on a shared context database — room
> protocol, role system, versioned governance handbook, delivery discipline, and
> watch cadence for turn-based agents.

## The problem

One person (or a small team) runs an AI agent instance on each of several machines — a Windows workstation, a cloud server, a LAN server, a dorm machine, even an offline box. These instances:

- have no idea what the others are doing; the human relays everything by hand;
- are session-scoped: organizational memory and lessons evaporate;
- must not open ports to each other or remote-execute freely — too risky, unauditable.

## The approach: change the organization, not the agent

1. **A shared context database as the only substrate** (an architectural choice of this method). Every machine reaches the same cloud-hosted store (e.g. OpenViking) over an ssh tunnel; zero inter-machine ports. Messages, memories, handbooks, and tasks live in the store — persistent and auditable by construction.
2. **A room protocol** ([spec/room-protocol.md](spec/room-protocol.md)) — append-only messaging: a `general.md` public channel, per-machine inboxes, per-role cursors; message ids encode machine-role-timestamp; payloads over 2KB become pointers (path + sha256 + bytes).
3. **A role system** ([docs/02-roles.md](docs/02-roles.md)) — per-machine diplomat (single outbound voice), mechanic, editor, coordinator, and more; one machine may hold several roles, each with its own cursor.
4. **Versioned governance** ([docs/03-governance.md](docs/03-governance.md)) — a four-volume handbook (red lines / cross-machine lessons / incident archive / collaboration dispatch) with an editor-in-chief, acknowledgment tracking, and weekly digests. Every red line traces back to a real incident.
5. **Delivery discipline + watch cadence** — files move only over pre-established channels announced as pointers ([spec/handoff-manifest.md](spec/handoff-manifest.md)); turn-based sessions keep watch on a schedule (hourly by day, every 2h at night) via reminder-driven wakeups ([docs/04-watchkeeping.md](docs/04-watchkeeping.md)).

## Repository layout

```
spec/         room protocol, handoff manifest (normative)
docs/         architecture, roles, governance, watchkeeping, onboarding, lessons
docs/research novelty assessment: comparison matrix, claim ladder, adversarial review
templates/    AGENTS.md / HANDBOOK.md / room init / red-line list templates
reference/    handbook.mjs — the tool used in production on the author's workstation
case-study/   a sanitized 11-day, 5-machine real deployment
tools/        Phase-A roadmap: a DSH plugin (cross-machine federation client)
```

Quick start: [docs/05-onboarding.md](docs/05-onboarding.md) (a new machine joins in ~30 minutes).

## Case study (sanitized)

2026-10-22 → 11-02, five heterogeneous machines ran this method: the protocol evolved through 4 backward-compatible minor versions in 10 days; 8 role types with multi-role machines; a 4-volume shared handbook iterated to v2.1.2 with 45 cross-machine lessons and 13 archived incidents; watch cadence institutionalized; multi-thousand-file deliveries completed with per-file sha256 verification. See [case-study/timeline.md](case-study/timeline.md).

## Relation to single-machine teams and platform schemes

- **DSH / Claude Code built-in Agent Teams, ruflo (formerly claude-flow)**: complementary, not replacements. They solve **single-machine** multi-agent work (shared process/cwd; ruflo adds single-box swarm + memory tree); this framework solves the **cross-machine** federation where instances are independent, environments heterogeneous, and the shared context database is the only link. The two compose.
- **AverNet (Ant inclusionAI)**: the closest platform-level neighbor in our search — persistent, organization-scale multi-agent infrastructure (identity/auth/discovery/routing/containers; ships a DeepSeek Harness channel plugin since 2026-09). Difference: AverNet is **platform infrastructure** (substrate = coordination network); this repo is a **zero-infrastructure method framework** (substrate = one plain shared context database, plus handbook governance, delivery discipline, watch cadence). Pick AverNet for platform capabilities; follow this repo to run a lightweight personal/small-team federation.

## Novelty stance

Per our search (2026-11): every individual mechanism has prior art; the nearest neighbors are AverNet (platform route), ruflo (single-box swarm), and the various built-in Agent Teams (see the 49-system × 10-dimension matrix at [docs/research/novelty-matrix.md](docs/research/novelty-matrix.md)). We found no public scheme isomorphic to the combination of *heterogeneous cross-machine instances + a shared context database as the collaboration substrate (a choice internal to this method) + versioned handbook governance + delivery-integrity protocol + turn-driven watch cadence + real-run evidence*. We avoid "first-ever" claims; counterexamples welcome via issues (claim ladder and downgrade plan: [docs/research/claim-ladder.md](docs/research/claim-ladder.md)).

## Roadmap

- **v0.1 (current)** — method framework (spec/docs/templates) + reference tool + sanitized case study
- **v0.2 (planned)** — a DSH plugin: `fed_room_scan`, `fed_room_post`, `fed_cursor_*`, `fed_handoff_verify`, `fed_ack_board` ([tools/PLUGIN-ROADMAP.md](tools/PLUGIN-ROADMAP.md))
- **v0.3+** — full English docs, more onboarding records, protocol v2 explorations (server-side dedup, permission isolation)

## License & disclaimers

Code: MIT. Docs: CC BY 4.0 (see [NOTICE.md](NOTICE.md)). A community project — not affiliated with DeepSeek (deepseek-harness) or OpenViking. Machine names in the case study are pseudonyms. Author: tlf.
