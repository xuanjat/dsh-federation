# dsh-federation: A Semantic-Level Coordination and Transport Plane for Heterogeneous Cross-Machine LLM-Agent Federations

**Author:** tlf (independent researcher)
**Status:** submission-grade draft (workshop / short-paper track); see `README.md` in this directory for conversion notes.
**License:** CC BY 4.0 (docs), consistent with the repository NOTICE.

---

## Abstract

Personal LLM-agent harnesses now run simultaneously on many heterogeneous machines (workstations, cloud servers, LAN boxes, offline nodes), yet each instance is a silo: its sessions, files, and learned lessons do not cross machine boundaries, and letting one agent operate another machine's shell is a security red line. We present **dsh-federation**, a zero-infrastructure method framework that federates *independent* agent instances through a single shared, plain-text context database. Its core is a **semantic-level transport model**: messages carry only speech-act headers (five performatives), four-coordinate identities, and monotonic timestamps; anything larger than a small threshold travels as a **content-addressed pointer** (path + SHA-256 + byte count) that is verified *outside* any agent's context window. We formalize the message calculus and prove three cost properties: per-delivery context cost is O(header) and independent of payload size; novelty detection is O(1) via fixed-width timestamp comparison; and k-hop relay adds zero repeated context payment because pointers are idempotent. Around the transport we specify organizational governance — a versioned, incident-driven handbook with red lines, role-scoped acknowledgment obligations, and time-triggered watchkeeping suited to turn-based agents. We report a sanitized eleven-day field deployment across five heterogeneous machines (protocol v1.0→v1.4, eight role types, 45 cross-machine lessons, 13 archived incidents, multi-thousand-file deliveries with per-file digest verification) and a 49-system novelty assessment. Per our search (2026-11), no public scheme is isomorphic to this combination; we state claims at a deliberately conservative level.

**Keywords:** multi-agent systems, LLM agents, agent communication, semantic communication, content addressing, coordination artifacts, organizational governance, field deployment.

---

## 1. Introduction

A single developer or small team today routinely operates several LLM-agent instances: one on a laptop, one on a cloud server, one on a LAN machine without external network, and so on. Each instance is *turn-based* (it acts, returns, and is re-invoked), *context-bounded* (its working memory is a token window that is billed and that degrades with length), and *environment-privileged* (it holds credentials and shell rights on exactly one machine). Three consequences follow.

1. **Silos.** Lessons learned on machine A (a command trap, a config pitfall, an incident root cause) are invisible to machine B unless a human copies them.
2. **Context scarcity as the true bandwidth.** When agents collaborate, the scarce channel is not network bandwidth but the context window: every byte that enters it is paid for in tokens and competes with the task at hand.
3. **The remote-shell red line.** The naive fix — letting agent A ssh into machine B and run commands — merges trust domains and is exactly what operational red lines forbid ("never operate another machine on its behalf").

Existing answers address *single-host* multi-agent work (built-in agent teams, swarm frameworks) or *platform-scale* infrastructure (organization-level agent substrates with identity, discovery, and container orchestration). Neither fits the personal/small-team setting: independent heterogeneous instances, no open ports, no broker clusters, no budget for platform operations, and a human who must be able to audit everything by reading plain text.

**Positioning as a research prototype.** dsh-federation is a research prototype for cross-architecture, cross-harness multi-agent collaboration and work relay: independent agent instances on different machine architectures — and even different builds of DSH-class harnesses — hand work to one another through the federation, and compared with traditional single-session execution it obtains efficient deployment and convenient operation at near-zero marginal cost (no broker, no open ports, no platform team). Concurrently, the DeepSeek Harness team's Super-agent design exploration [31] reports the same attention bottleneck — a human sustains only 3–5 active sessions — and answers it inside one organization's footprint with a two-layer Router/Worker architecture, event-driven triggers, speculative execution, and a Watchdog session, while listing cross-instance A2A communication and cross-session human collaboration as open problems. We occupy exactly that open slot from the opposite direction: rather than redesigning the interior of one agent stack, we federate already-deployed independent instances with plain-text organizational artifacts, across machines and harness builds.

**Contributions.** (i) A method framework that federates independent, heterogeneous LLM-agent instances over one shared plain-text context database with **zero additional infrastructure** (§3). (ii) A **semantic-level transport model** with a message calculus and three cost propositions (§4), positioned against speech-act communication, tuple spaces, publish/subscribe with consumer offsets, content addressing, and provenance standards. (iii) An **organizational governance layer**: versioned incident-driven handbook, red-line evolution, role-scoped acknowledgment obligations, and time-triggered watchkeeping for turn-based agents (§5). (iv) A **sanitized field study** (five machines, eleven days) plus a 49-system × 10-dimension novelty assessment with an explicit claim ladder (§6, §7).

## 2. Setting and Constraints

**Agents.** Each node is a turn-based LLM-agent harness (we deploy on DeepSeek Harness; the method is harness-agnostic). An agent cannot block: between turns it is inert. Hence all liveness must come from *scheduled re-invocation*, not from listening sockets.

**Substrate.** One shared context database reachable by every node through *some* path: an outbound ssh tunnel, a local/sshfs mount, or — for a node with no network at all — a human or peer relay carrying files. The substrate stores UTF-8 text; binary payloads live in an attached store and are referenced, never embedded.

**Threat and audit model.** No inbound ports; no agent ever executes commands on another machine; every coordination artifact is append-only plain text that a human can read end-to-end; integrity rests on SHA-256 digests computed outside agent contexts. Credentials never appear in the shared substrate.

**Heterogeneity.** Nodes differ in OS, model backend, network reachability, and uptime. The only required capability is reading and writing UTF-8 text files.

## 3. The Room: Coordination Artifact as Transport

The federation's coordination state lives in a *room*: a directory of append-only Markdown logs.

- `general.md` — the public channel;
- `inbox/<machine>.md` — per-machine inbound queue;
- `cursor/<machine>-<role>.md` — per-role consumption offsets;
- role and governance texts elsewhere in the shared database.

A **message** is a fenced block with a YAML-like header and a body:

```
---
mid: <machine>-<role>-<YYYYMMDDTHHMMSS>
from: <machine>
role: <role>
to: <machine> | general
ts: <ISO-8601>
type: ask | reply | note | data | ack
re: <mid>            # mandatory for reply
---
<body, or pointer lines for type=data>
```

Design rules, each traceable to a real incident in the field study:

- **R1 (append-only).** Logs are never rewritten; corrections are new messages. Provenance is structural.
- **R2 (seconds-granular ids).** `mid` embeds a fixed-width timestamp *with seconds*; two roles on one machine posting in the same minute collided before this rule.
- **R3 (tail-timestamp novelty).** "Have I seen this?" compares only the fixed-width timestamp suffix of `mid`. Comparing whole ids lexicographically is a trap: machine-name prefixes reorder ids across machines.
- **R4 (payload threshold).** Bodies above 2 KB must become `data` messages whose body is pointer lines `data: <path>  sha256=<hex>  bytes=<n>`.
- **R5 (one cursor per role).** Cursors are per (machine, role); sharing one cursor across roles on a multi-role machine lost messages.
- **R6 (no secrets).** The substrate carries no tokens, keys, or personal data; payloads with such content stay out of the shared store entirely.

## 4. Semantic-Level Transport Model

### 4.1 Message calculus

**Definition 1 (semantic message).** A message is a triple $d = (a, p, r)$ where $a$ is the *act header* (performative $\pi \in \{$ask, reply, note, data, ack$\}$, identity four-tuple $(m_{from}, \rho_{from}, m_{to}, \rho^*_{to})$, monotonic timestamp $t$, and optional referent $re$), $p$ is an optional *content-addressed pointer* $(\text{path}, h, n)$ with $h = \text{SHA-256}$ and byte count $n$, and $r$ is an optional inline residue with $|r| \le B$ (deployment value $B = 2$ KB).

**Definition 2 (channel).** A channel $C$ is an append-only sequence $d_1, d_2, \dots$; its *semantic projection* is the sequence of headers and pointers only.

**Definition 3 (cursor).** For consumer $(m, \rho)$, $\kappa(m,\rho) \in \mathbb{N}$ is the index of the last consumed element; novelty is the suffix test of R3 applied to elements beyond $\kappa$.

**Definition 4 (delivery manifest).** A delivery of payload set $P = \{f_1, \dots, f_k\}$ is one `data` message whose pointer list enumerates $(\text{path}_i, h_i, n_i)$; acceptance requires, for each $i$, an out-of-context equality check $\text{SHA-256}(f_i) = h_i \land |f_i| = n_i$, after which the receiver posts `ack`.

**Definition 5 (watch schedule).** A function $W: \text{time} \to \{\text{invoke}, \varnothing\}$ re-invokes each role on a cadence (deployment: 1 h daytime, 2 h night), implementing time-triggered activation for agents that cannot listen.

### 4.2 Cost model

Let $H$ be header+pointer size (hundreds of bytes) and $|P|$ payload size.

**Proposition 1 (context cost).** The context-window cost charged to sender and receiver for one delivery is $O(H)$, independent of $|P|$.
*Sketch.* By R4 the payload never enters any context; only $a$ and $p$ do, plus one digest/boolean line from the out-of-context verifier. ∎

**Proposition 2 (O(1) novelty).** Given cursor $\kappa$, detecting whether new messages exist costs one fixed-width string comparison per channel, not a scan of message bodies.
*Sketch.* R3 makes the suffix a total order key; bodies are irrelevant to novelty. ∎

**Proposition 3 (relay idempotence).** Forwarding a pointer across $k$ hops charges $O(H)$ per hop and $O(H)$ total *semantic* cost to the federation: the pointer denotes the same content at every hop, so no hop re-pays payload context and verification remains end-to-end by digest equality.
*Sketch.* Content addressing makes $p$ location-independent; equality of $h$ is transitive. ∎

These properties map directly onto the failure taxonomy of LLM multi-agent systems ( MAST ): specification ambiguity is bounded by five performatives with mandatory referents; inter-agent misalignment is bounded by explicit ack obligations (§5); unrecoverable failures become visible because every act is logged append-only; and context poisoning/overflow is bounded by Proposition 1. We state this as *design intent*, not as measured efficacy.

### 4.3 Lineage

Speech acts → KQML → FIPA-ACL supply the performative discipline; Linda/blackboards supply shared coordination artifacts; publish/subscribe with consumer offsets (Kafka logs) supply cursors; Merkle/IPFS content addressing and W3C PROV supply pointers and provenance; event- vs time-triggered architecture supplies the watch schedule; goal-oriented semantic communication supplies the "transmit intent, not bits" stance. The combination — and its reduction to *plain files* as the universal narrow waist — is what we contribute.

## 5. Organizational Governance

Transport without governance decays: roles blur, obligations lapse, lessons evaporate. dsh-federation specifies four instruments.

**Roles.** Named posts per machine (diplomat, mechanic, editor, coordinator, …); a machine may hold several; every message header carries the posting role, making responsibility auditable.

**Versioned handbook with red lines.** Cross-machine lessons live in an append-only handbook with numbered entries and an index; operational prohibitions are *red lines* with monotonic numbering (never renumbered). Crucially, red lines are **incident-driven patches**: each of the 13 archived incidents in the field study produced at least one rule (e.g., a session-registry overwrite incident produced the "never rewrite coordination state" family; a tunnel-death incident produced the watchdog rule). The handbook is thus a living patch series over the organization's failure surface.

**Acknowledgment obligations.** Borrowing commitment-based MAS semantics: a `data` or `ask` message creates a debtor obligation on its addressee, discharged only by `ack` or `reply`. A derived **ack board** (two columns: inbound obligations uncleared; outbound messages awaiting discharge) is computable from the logs alone and drives the watch turns.

**Time-triggered watchkeeping.** Because agents cannot block (Definition 5), liveness is a schedule. Cadence is a policy parameter (day/night tiers), and each watch turn is a fixed checklist: scan cursors, discharge obligations, update the board, escalate staleness.

## 6. Field Study (sanitized)

Five heterogeneous machines (a Windows workstation, a cloud Linux server hosting the shared database, a LAN node, a dormitory node, and an offline node served by relay) ran the method for eleven days (2026-10-22 → 11-02). Machine names are pseudonyms; all identifiers, paths, and contents are sanitized.

- **Protocol evolution:** v1.0 → v1.4 in ten days, all changes backward-compatible; each minor version traceable to incidents or onboarding friction.
- **Organization:** 8 role types; multi-role machines; one editor-in-chief owns the shared handbook (v2.1.2: four volumes, 45 cross-machine lessons, 15 red lines, 13 incident archives).
- **Deliveries:** multi-thousand-file packages (chapter drafts, figure sets, CSV matrices) moved as pointer manifests with per-file SHA-256 + byte verification; zero undetected corruption; context cost per delivery observed at header scale.
- **Liveness:** watch cadence institutionalized (1 h day / 2 h night); a 48-hour escalation rule for unanswered obligations; weekly digest.
- **Failure pedagogy:** the four protocol rules R2, R3, R5 and the newline-handling rule each exist because a real message was lost or misordered without them.

We report this as *existence evidence* for operability, not as a controlled evaluation.

## 7. Novelty Assessment and Claim Ladder

We compared 49 systems across 10 dimensions (single-host orchestrators; cross-machine protocols; Claude/DSH ecosystems; memory systems; academic simulations; governance toolkits). Nearest neighbors: (a) **platform substrates** for organization-scale persistent agents (identity/discovery/routing/containers; one ships a harness channel plugin) — different route: they *are* infrastructure, we require none; (b) **single-box swarm frameworks** with hierarchical memory — complementary, not cross-machine; (c) **built-in single-host agent teams** — complementary; (d) **concurrent single-organization super-agent architecture** (two-layer Router/Worker, event triggers with thread subscription, Inline & Spill and Chain-of-Recall context mechanics, Watchdog control loop; prototype plugin `dsh-superagent-prototype`) [31] — same motivation (attention bottleneck, session silos), different unit of redesign: they re-engineer one organization's agent interior with programmatic routing and push events on a single harness deployment, whereas we leave every instance untouched and add only a cross-instance organizational layer that works across machines and harness builds; their stated open problems (A2A between agent instances, collaboration detached from sessions) are precisely the surfaces our room protocol, pointer delivery, and ack obligations specify. Per our search (2026-11), no public scheme combines heterogeneous cross-machine instances + a shared plain-text context database as the sole substrate + versioned incident-driven handbook governance + pointer-based delivery-integrity protocol + turn-driven time-triggered watchkeeping + field evidence. Our claim ladder states results at level L2 ("combination unseen in search") with contribution-style L3 sentences; "first-ever" claims are explicitly disclaimed, and the strongest single dimension is the delivery-integrity protocol (digest discipline outside context), the weakest are topology discovery and human-in-the-loop design.

## 8. Limitations

No push delivery (polling only); no server-side deduplication or permission isolation in the substrate (compensated by cursor discipline and red lines); a single shared trust root; parameters (2 KB, cadences) are deployment choices, not optima; metrics are self-reported from one organization; the MAST alignment is design intent, not measured efficacy; the comparison with concurrent super-agent designs [31] is qualitative — their measurements run on synthetic loads, ours on sanitized field logs, and no head-to-head benchmark exists.

## 9. Conclusion

dsh-federation shows that a federation of independent, heterogeneous LLM agents can be coordinated with *nothing but text*: semantic headers and content-addressed pointers keep the scarce resource — context — free of payloads, while a versioned handbook, ack obligations, and time-triggered watchkeeping keep the organization alive between turns. The eleven-day five-machine deployment suggests the design is not merely consistent but operable, and its incident-driven rule set is a reusable artifact for anyone running personal agent federations.

## References

1. Searle, J. R. (1969). *Speech Acts: An Essay in the Philosophy of Language*. Cambridge University Press.
2. Finin, T., et al. (1994). KQML as an agent communication language. *CIKM '94*.
3. FIPA (2002). *FIPA Communicative Act Library Specification*, SC00037.
4. Gelernter, D. (1985). Generative communication in Linda. *ACM TOPLAS*, 7(1).
5. Nii, H. P. (1986). Blackboard systems. *AI Magazine*, 7(2).
6. Eugster, P. Th., Felber, P. A., Guerraoui, R., & Kermarrec, A.-M. (2003). The many faces of publish/subscribe. *ACM Computing Surveys*, 35(2).
7. Kreps, J., Narkhede, N., & Rao, J. (2011). Kafka: a distributed messaging system for log processing. *NetDB '11*.
8. Merkle, R. C. (1980). Protocols for public key cryptosystems. *IEEE Symposium on Security and Privacy*.
9. Benet, J. (2014). IPFS — content addressed, versioned, P2P file system. *arXiv:1407.3561*.
10. Moreau, L., et al. (2013). *PROV-Overview: An Overview of the PROV Family of Documents*. W3C.
11. Shannon, C. E., & Weaver, W. (1949). *The Mathematical Theory of Communication*. University of Illinois Press.
12. Kopetz, H. (1991). Event-triggered versus time-triggered real-time systems. *Dagstuhl Seminar: Operating Systems of the 90s*.
13. Theraulaz, G., & Bonabeau, E. (1999). A brief history of stigmergy. *Artificial Life*, 5(2).
14. Malone, T. W., & Crowston, K. (1994). The interdisciplinary study of coordination. *ACM Computing Surveys*, 26(1).
15. Esteva, M., Rodríguez-Aguilar, J. A., Sierra, C., García, P., & Arcos, J. L. (2001). On the formal specification of electronic institutions. *AMEC III*, Springer.
16. Hübner, J. F., Sichman, J. S., & Boissier, O. (2013). *Organizing Multi-Agent Systems*. Springer.
17. Singh, M. P. (1999). An ontology for commitments in multiagent systems. *Artificial Intelligence and Law*, 7(1).
18. Guo, T., et al. (2024). Large language model based multi-agents: a survey of progress and challenges. *arXiv:2402.01680* (IJCAI 2024).
19. Cemri, M., et al. (2025). Why do multi-agent LLM systems fail? *arXiv:2503.13657* (NeurIPS 2025 Datasets & Benchmarks).
20. Zhang, Z., et al. (2024). A survey on the memory mechanism of large language model based agents. *arXiv:2404.13501*.
21. Liu, N. F., et al. (2024). Lost in the middle: how language models use long contexts. *TACL* (arXiv:2307.03172).
22. Chen, L., Zaharia, M., & Zou, J. (2023). FrugalGPT: how to use large language models while reducing cost and improving performance. *arXiv:2305.05176*.
23. Goal-oriented semantic communication for intelligent networks: a survey. (2025). *arXiv:2512.12758*.
24. Wu, Q., et al. (2023). AutoGen: enabling next-gen LLM applications via multi-agent conversation. *arXiv:2308.08155*.
25. Hong, S., et al. (2023). MetaGPT: meta programming for a multi-agent collaborative framework. *arXiv:2308.00352*.
26. Qian, C., et al. (2023). Communicative agents for software development. *arXiv:2307.07924*.
27. Linux Foundation (2025). *Agent2Agent (A2A) protocol specification*.
28. inclusionAI (2026). *AverNet: infrastructure for persistent, organization-scale multi-agent systems* (repository documentation).
29. ruflo (formerly claude-flow) (2026). *Single-box agent swarm orchestration with hierarchical memory* (repository).
30. DeepSeek (2026). *deepseek-harness* and its built-in single-host Agent Teams; OpenViking shared context database.
31. DeepSeek Harness Team (2026). *Super-agent设计探索：迈向更自主的Agent系统* (architecture exploration article, 2026-11-01; prototype: dsh-superagent-prototype); coverage: DoNews/PChome, 2026-11-01.
