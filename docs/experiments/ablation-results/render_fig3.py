# -*- coding: utf-8 -*-
"""fig3-ablation: A0 (single-session sequential baseline) vs A1 (two independent sessions
federated through the room protocol), 3 rounds x 6 tasks, same-window latin square
(R1 A0->A1 / R2 A1->A0 / R3 A0->A1), executed 2026-11-09 by the nuomi-room crew.

Data source: ./summary.csv (36 task rows; OV-channel copy, sha256 08a55b...58e94;
original local file 2308B sha256 28f5f4...96203, trailing newline stripped by the OV
write API, byte-identical otherwise). Companion log: ./实验记录.md.

Render: matplotlib only (scienceplots optional), Tol bright colors, vector PDF + 300dpi PNG.
Numbers only; task content stays abstracted.
"""
from __future__ import annotations
import csv, statistics
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

HERE = Path(__file__).resolve().parent
C_A0, C_A1 = "#4477AA", "#EE7733"
plt.rcParams.update({
    "font.family": "serif", "font.size": 9.5, "axes.linewidth": 0.8,
    "axes.spines.top": False, "axes.spines.right": False,
    "figure.dpi": 120, "savefig.bbox": "tight",
})

def load():
    with (HERE / "summary.csv").open(encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    for r in rows:
        for k, v in r.items():
            if k not in ("arm", "round", "task_id", "round_status", "note"):
                r[k] = float(v) if v not in ("", None) else 0.0
    return rows

def mean(rs, key):
    return statistics.mean(r[key] for r in rs)

rows = load()
rounds = [1, 2, 3]
a0 = {rd: [r for r in rows if r["arm"] == "a0" and int(r["round"]) == rd] for rd in rounds}
a1 = {rd: [r for r in rows if r["arm"] == "a1" and int(r["round"]) == rd] for rd in rounds}
tasks = [f"T{i}" for i in range(1, 7)]

fig, axes = plt.subplots(2, 2, figsize=(7.2, 5.4))
fig.subplots_adjust(hspace=0.44, wspace=0.28)

# ---------- (a) E1 makespan per round ----------
ax = axes[0, 0]
x = range(3); w = 0.36
v0 = [mean(a0[r], "E1_makespan_s") for r in rounds]
v1 = [mean(a1[r], "E1_makespan_s") for r in rounds]
b0 = ax.bar([i - w/2 for i in x], v0, w, label="A0 single-session", color=C_A0, edgecolor="black", linewidth=0.6)
b1 = ax.bar([i + w/2 for i in x], v1, w, label="A1 federation", color=C_A1, edgecolor="black", linewidth=0.6)
for bars in (b0, b1):
    for b in bars:
        ax.text(b.get_x() + b.get_width()/2, b.get_height(), f"{b.get_height():.0f}", ha="center", va="bottom", fontsize=7.5)
m0, m1 = statistics.mean(v0), statistics.mean(v1)
ax.axhline(m0, color=C_A0, ls="--", lw=0.9, alpha=0.85)
ax.axhline(m1, color=C_A1, ls="--", lw=0.9, alpha=0.85)
ax.text(2.72, m0 + 6, f"mean {m0:.1f}", color=C_A0, fontsize=7.5, va="bottom", ha="left")
ax.text(2.72, m1 - 24, f"mean {m1:.1f}", color=C_A1, fontsize=7.5, va="bottom", ha="left")
ax.set_xticks(list(x)); ax.set_xticklabels(["R1", "R2", "R3"])
ax.set_xlim(-0.6, 3.4)
ax.set_title("(a) E1: makespan per round (s)", fontsize=9.5)
ax.set_ylim(0, 330)
ax.set_ylabel("seconds"); ax.legend(fontsize=7.5, frameon=False, loc="upper left")
ax.annotate(f"{m0/m1:.2f}x / 34% faster", xy=(0.5, max(v0)*0.72), ha="center", fontsize=8.5)

# ---------- (b) E2 per-task mean latency ----------
ax = axes[0, 1]
lat0 = [mean([r for r in rows if r["arm"] == "a0" and r["task_id"] == t], "E2_latency_s") for t in tasks]
lat1 = [mean([r for r in rows if r["arm"] == "a1" and r["task_id"] == t], "E2_latency_s") for t in tasks]
x = range(6)
ax.bar([i - w/2 for i in x], lat0, w, color=C_A0, edgecolor="black", linewidth=0.6)
ax.bar([i + w/2 for i in x], lat1, w, color=C_A1, edgecolor="black", linewidth=0.6)
ax.set_xticks(list(x)); ax.set_xticklabels(tasks)
ax.set_title("(b) E2: per-task latency (s, mean of n=3)", fontsize=9.5)
ax.set_ylabel("seconds")

# ---------- (c) E3 context bytes per task, stacked ----------
ax = axes[1, 0]
a0rows = [r for r in rows if r["arm"] == "a0"]
a1rows = [r for r in rows if r["arm"] == "a1"]
p0, pt0 = mean(a0rows, "E3_payload_bytes"), mean(a0rows, "E3_pointer_bytes")
p1, pt1 = mean(a1rows, "E3_payload_bytes"), mean(a1rows, "E3_pointer_bytes")
t0 = mean(a0rows, "E3_context_bytes"); t1 = mean(a1rows, "E3_context_bytes")
o0, o1 = t0 - p0 - pt0, t1 - p1 - pt1
ax.bar(["A0\n(single-session)", "A1\n(federation)"], [p0, p1], 0.5,
       color=[C_A0, C_A1], edgecolor="black", linewidth=0.6, label="task payload")
ax.bar(["A0\n(single-session)", "A1\n(federation)"], [pt0, pt1], 0.5, bottom=[p0, p1],
       color="#CCBB44", edgecolor="black", linewidth=0.6, hatch="//", label="room pointers")
ax.bar(["A0\n(single-session)", "A1\n(federation)"], [o0, o1], 0.5, bottom=[p0+pt0, p1+pt1],
       color="#999999", edgecolor="black", linewidth=0.6, alpha=0.75, label="session ops")
ax.text(0, t0 + 40, f"{t0:.0f}", ha="center", fontsize=9)
ax.text(1, t1 + 40, f"{t1:.0f}", ha="center", fontsize=9)
ax.set_title("(c) E3: context bytes per task", fontsize=9.5)
ax.set_ylabel("bytes"); ax.set_ylim(0, 3500); ax.legend(fontsize=7, frameon=False)

# ---------- (d) E4 interaction cost per round ----------
ax = axes[1, 1]
u0 = [mean(a0[r], "E4_turns") for r in rounds]
u1 = [mean(a1[r], "E4_turns") for r in rounds]
msg1 = [int(mean(a1[r], "E4_room_messages")) for r in rounds]
b0 = ax.bar([i - w/2 for i in x[:3]], u0, w, color=C_A0, edgecolor="black", linewidth=0.6)
b1 = ax.bar([i + w/2 for i in x[:3]], u1, w, color=C_A1, edgecolor="black", linewidth=0.6)
for b in b0:
    ax.text(b.get_x() + b.get_width()/2, b.get_height(), f"{b.get_height():.0f}", ha="center", va="bottom", fontsize=7.5)
for i, (b, nm) in enumerate(zip(b1, msg1)):
    same = abs(u1[i] - u0[i]) < 0.01
    ax.text(b.get_x() + b.get_width()/2 + (0.16 if same else 0), b.get_height(),
            f"{b.get_height():.0f}\n(+{nm} msgs)", ha="left" if same else "center", va="bottom", fontsize=7)
ax.set_xticks(list(x[:3])); ax.set_xticklabels(["R1", "R2", "R3"])
ax.set_xlim(-0.6, 2.98)
ax.set_ylim(0, 12.5)
ax.set_title("(d) E4: turns per round (+room msgs)", fontsize=9.5)
ax.set_ylabel("turns")

fig.text(0.5, -0.075,
    "Controlled ablation on DSH agents, 2026-11-09: 3 rounds x 6 abstracted tasks, same-window latin square,\n"
    "36/36 artifacts, first pass 18/18 per arm, zero fallback / human interventions (E6=0). n=3; no significance test claimed.\n"
    "A1 cuts makespan 34% with 3x lower variance, at +1.3 turns and +57% context bytes per task.\n"
    "Verdicts: H1 supported · H2 unsupported at small payload (payload-scale dependent) · H3 supported · H4 parity (18/18 first-pass both arms).",
    ha="center", fontsize=7.3, style="italic", color="#444444")

fig.savefig(HERE / "fig3-ablation.pdf")
fig.savefig(HERE / "fig3-ablation.png", dpi=300)
print("saved fig3 pdf+png")
