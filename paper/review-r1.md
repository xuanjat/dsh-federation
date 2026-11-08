# Peer-review round 1 — paper/main.md (five-seat panel, 2026-11-08)

Method: academic-paper-reviewer skill (5 role-separated seats + editorial synthesis), executed by an independent fresh-context reviewer subagent against main.md (179-line revision, post-polish pass). Severity tags: CRITICAL / MAJOR / MINOR. This file records the panel report verbatim (condensed headers only) and the revision disposition of every item.

## Editorial decision

**Major Revision** (panel recommendation). Top-5 fixes demanded: (1) repair Proposition 1 (manifest assumption, bound in k); (2) make novelty verifiable (publish 49×10 matrix artifact, name [28]/[29], wire in-text citations); (3) add distributed-systems candor paragraph (atomic appends, clock skew, authenticity vs integrity, relay consistency, prompt injection); (4) quantify field study + add one architecture figure; (5) de-escalate verbs ("prove"→"establish", "shows"→"suggests"), reconcile day count and "each traceable to an incident".

## Seat findings (condensed record)

### Seat 1 — Venue fit (cs.MA short paper)
- [MAJOR] Genre split: §4 calculus signals theory paper; §6 is experience report. → DISPOSITION: kept both but re-scoped: props restated as design-level cost properties "under stated assumptions"; abstract verb downgraded.
- [MAJOR] Zero figures/tables. → DEFERRED to tlf (figure-designer pass; see Open items).
- [MAJOR] No artifact/data-availability statement. → FIXED: §6 "Artifact availability" paragraph + §7 matrix-artifact sentence (github.com/xuanjat/dsh-federation, docs/research/).
- [MINOR] Line 4 Status line must be stripped before posting. → HANDLED: arXiv build's sanitize step strips the header block (verified in this rebuild).
- [MINOR] Abstract number-stuffed. → PARTIAL: "eleven-day (elapsed)" clarified; numbers kept as evidence (author call to trim further).
- [MINOR] Contribution (iv) references undefined L2/L3 machinery. → FIXED: claim ladder now defined inline in §7 (L0/L1 forbidden, L2 combination, L3 contribution, L4 reusability).
- [MINOR] Two oversized paragraphs vs [31]. → KEPT (tlf-requested positioning); §7 paragraph split for readability in polish pass.
- [MINOR] Title noun-stacked; consider shorter. → DEFERRED to tlf.
- [MINOR] Cross-list cs.DC. → ALREADY in metadata.md (cross: cs.DC, cs.AI).
- [MINOR] Add repo URL to offset lone-author credibility gap. → FIXED via artifact-availability paragraph.

### Seat 2 — Methodology (message calculus)
- [CRITICAL] Prop 1 contradicted by Def 4 + multi-thousand-file manifests (Θ(k·H) header context); out-of-context manifest assumption nowhere stated. → FIXED: Prop 1 restated with explicit *manifest assumption*; bound O(k·H) independent of payload bytes; two-case bound (manifest as file → O(H) constant). Abstract aligned.
- [MAJOR] Abstract "zero repeated context payment" vs Prop 3 "O(H) per hop". → FIXED: abstract now "never re-pays payload context"; Prop 3 keeps per-hop O(H).
- [MAJOR] Prop 3 "O(H) total *semantic* cost" muddled. → FIXED: phrase removed; per-hop header cost + zero payload re-payment stated separately.
- [MAJOR] Def 1 monotonic timestamp hides cross-machine clock assumption; R3 tail order can invert under skew. → FIXED: "per-producer monotonic"; skew bound moved to §8 candor (iv).
- [MAJOR] Def 3/Prop 2 conflate index vs timestamp cursor state; partial replication ill-defined. → FIXED: Def 3 now records last-consumed *identifier* (embedded timestamp), per-consumer per-channel, well-defined under partial replication.
- [MINOR] "prove" overclaims one-line sketches. → FIXED: abstract "establish ... under stated assumptions"; body keeps Sketch+∎.
- [MINOR] Def 5 type-sloppy {invoke, ∅}. → FIXED: {invoke, skip}.
- [MINOR] ρ*_to unexplained, no wire counterpart. → FIXED: wildcard-role gloss added in Def 1.
- [MINOR] Two timestamps (mid suffix vs ts:) — authority unspecified. → PARTIAL: Def 3 anchors novelty to the mid-embedded timestamp; explicit "authoritative field" sentence flagged as Open item (needs protocol-doc alignment).
- [MINOR] "equality of h is transitive" vacuous. → FIXED: sketch now invokes SHA-256 collision resistance as the stated assumption.
- [MINOR] Line 65 "each traceable to a real incident" contradicts §6/§8. → FIXED: "distilled from the field study; several are direct patches for recorded incidents".
- [MINOR] "newline-handling rule" not among R1–R6. → FIXED: now "a handbook parsing rule (message-fence handling)".

### Seat 3 — Domain (LLM MAS)
- [MAJOR] [1]–[30] never cited in text. → FIXED: 30 in-text markers wired (§1 [18][21,22][24-26][27][28][29,30]; §4.2 [19]; §4.3 [1-14][23]; §5 [15,16][17]; §7 [24-30]). All 31 refs now cited.
- [MAJOR] 49-system ladder unverifiable (no matrix/names/queries). → FIXED: artifact pointer to docs/research/novelty-matrix.md, search-log.md, adversarial-review.md, claim-ladder.md (public repo).
- [MAJOR] Nearest neighbors anonymized in prose. → FIXED: AverNet [28] and ruflo [29] named in §7.
- [MAJOR] "harness-agnostic" unsupported (all five nodes DSH). → FIXED: §1 "cross-harness by design"; §2 states all field nodes run DSH builds, second family not yet fielded.
- [MAJOR] Field study quantitatively empty. → PARTIAL: honest re-wording ("not separately metered"); quantification (message counts, latency, token table) flagged as Open item — needs log extraction, no fabrication allowed.
- [MAJOR] Missing comparators MCP/LangGraph/CrewAI/MemGPT; A2A never contrasted. → PARTIAL: A2A contrast sentence added in §7; memory systems covered by [20] in matrix artifact; adding new comparator refs deferred (would need matrix re-run).
- [MINOR] MAST uncited at use. → FIXED: "Multi-Agent System Failure Taxonomy (MAST) [19]".
- [MINOR] "zero undetected corruption" unfalsifiable. → FIXED: "zero digest mismatches across all verified files".
- [MINOR] Stigmergy [13] never invoked. → FIXED: §4.3 lineage sentence.
- [MINOR] Eleven days = 12 inclusive. → FIXED: "eleven elapsed days ...; twelve calendar days inclusive".

### Seat 4 — Distributed systems
- [CRITICAL] Concurrent-append safety unaddressed (sshfs no atomic append/locking). → FIXED (candor): §8 (i) — discipline not guarantee, stated plainly.
- [MAJOR] Integrity ≠ authenticity (digest recomputable by any writer). → FIXED: §2 parenthetical + §8 (ii).
- [MAJOR] Substrate is a prompt-injection bus. → FIXED: §8 (iii), flagged as open problem for LLM federations.
- [MAJOR] Relay/offline consistency + dedup undefined. → FIXED (candor): §8 (v).
- [MAJOR] No recovery procedures for lost cursor / dead watcher. → PARTIAL: §8 (vii) liveness bound; recovery procedures flagged as protocol work (v0.4 candidate).
- [MINOR] Clock-skew bound unstated. → FIXED: §8 (iv).
- [MINOR] "zero additional infrastructure" vs cloud server. → FIXED: abstract/contributions now "no broker or middleware beyond that store"; §7 keeps "nothing beyond one shared store".
- [MINOR] Unbounded growth, no GC. → FIXED: §8 (vi).
- [MINOR] Worst-case obligation latency unanalyzed. → FIXED: §8 (vii) bound = cadence + 48 h.
- [MINOR] mid seconds collision. → FIXED: §8 (iv).

### Seat 5 — Devil's advocate
- [CRITICAL] "Shared folder + ops wiki" reductio; propositions are consequences of the design rule, not theorems. → PARTIAL: Prop 1 now carries a real two-case bound + explicit assumption; genre honesty kept ("design intent, not measured efficacy"; existence evidence). The "why the combination is a research contribution" framing rests on §4.3 lineage + §7 ladder — accepted as position-paper defense, no further change.
- [MAJOR] Novelty = argument from ignorance (conjunctive framing manufactures uniqueness). → MITIGATED: ladder L2 wording already "per our search ... no public scheme"; matrix artifact now linked so readers can check the conjunction. No upgrade of claim strength.
- [MAJOR] "shows" exceeds N=1 evidence; survivorship bias. → FIXED: "suggests"/"indicates" in §9; §6 keeps existence-evidence disclaimer.
- [MAJOR] Security red-line framing relocates risk rather than removing it. → FIXED: §2 "(a corruption check, not an authenticity control)" + §8 (ii)(iii) make the relocation explicit.
- [MINOR] Marketing prose line 27 ("efficient deployment and convenient operation"). → FIXED: grounded as "the same class of multi-agent coordination at near-zero marginal infrastructure cost in our deployment" (tlf positioning intent preserved, comparatives removed). FLAGGED to tlf as touches-meaning.
- [MINOR] Internal contradiction line 65 vs 127. → FIXED (see Seat 2).
- [MINOR] Self-graded superlatives without matrix. → FIXED: matrix artifact linked in same paragraph.

### Copy-editing / references
- [MAJOR] Uncited refs → FIXED (above). [MAJOR] MAST unexpanded → FIXED.
- [MINOR] DSH never expanded → FIXED (§1 "DeepSeek Harness (DSH) family [30]").
- [MINOR] A2A/KQML/FIPA-ACL/IPFS unexpanded → FIXED at first use (A2A §1; others in §4.3 lineage names).
- [MINOR] L2/L3 undefined → FIXED. Number style "8 role types" → FIXED. Day count → FIXED. Line 127 punctuation → FIXED (reworded).
- Reference repairs: [2] full author list (Finin, Fritzson, McKay, McEntire) + proceedings; [12] LNCS 563, pp. 87–117, Springer; [23] **identity corrected** — arXiv:2512.12758 is actually Luo/Delfani/Salimnejad/Pappas, "From information freshness to semantics of information and goal-oriented communications" (verified via arxiv.org metadata); [28] URL verified via GitHub API (inclusionAI/Avernet) + access date; [29] URL (github.com/ruvnet/ruflo, from novelty-matrix record); [31] DoNews + PChome URLs added, English gloss in brackets.
- [MINOR] Still incomplete (flagged, not fabricated): [3] FIPA SC00037 URL/status; [16] Hübner et al. year/venue verify (2013 vs 2007 DALT lineage); [30] artifact URLs.

## Open items for tlf (need author decision or new data — not done silently)
1. **Architecture figure** (Seat 1 MAJOR): at least one topology/sequence figure (room layout + pointer delivery flow). Suggest next iteration with figure-designer skill (TikZ or SVG→PDF).
2. **Field-study quantification** (Seat 3 MAJOR): message counts, delivery latency, files digest-verified, token-cost table — requires extracting numbers from room logs/handbook; cannot be fabricated.
3. **Title shortening** (Seat 1 MINOR) — author call.
4. **Abstract numeric trim** (Seat 1 MINOR) — author call.
5. **Ref completion**: [3] URL, [16] year verify, [30] URLs.
6. **mid vs ts authoritative-field sentence** (Seat 2 MINOR) — needs one protocol-doc decision.
7. **Recovery procedures** for lost cursor / dead watcher (Seat 4 MAJOR→v0.4 plugin work: fed_watchdog_note already covers part).
8. arXiv author/affiliation/license decisions (pre-existing, unchanged).

## Revision summary (round 1)
- 39 edits applied to paper/main.md (30 batch-1 + 9 batch-2), all language/spec-level; no data, citation, or result fabricated; one meaning-touching softening flagged (line 27 positioning sentence).
- All 3 CRITICAL items addressed (Prop 1 restated; append-safety candor; reductio partially absorbed via assumptions + genre honesty).
- MAJOR items: 10 fixed, 3 partial (quantification, comparators, recovery), figure deferred.
- Paper grew 21.8 KB → 26.6 KB (179 → 184 lines); arXiv PDF rebuilt and page-count re-verified in this round.
