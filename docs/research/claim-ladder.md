# murmuration 新颖性主张阶梯（claim-ladder）

目的：给对外文案（README、文档、发言）提供一档"可辩护的新颖性口径"。规则：**所有等级都不得使用"首创/第一/唯一"式无限定断言**；凡涉新颖性一律带"据检索（2026-11）"限定；依据见 [novelty-matrix.md](novelty-matrix.md)，反方视角见 [adversarial-review.md](adversarial-review.md)。

## 主张阶梯总表

| 级别 | 性质 | 中文表述（示例） | 英文表述（示例） | 依据强度 | 风险 | 建议 |
|---|---|---|---|---|---|---|
| **L0** | 不可靠 | "世界首个多机 agent 联邦框架" / "业界首创" | "the world's first cross-machine agent federation" | 无（无法穷尽证明"第一"） | 极高：一句反例即翻车；且违反本项目红线（不营销、不夸大） | ❌ 禁用 |
| **L1** | 强主张 | "首个开源的跨机异构 agent 联邦协作方法框架" | "the first open-source framework for federating heterogeneous agent instances across machines" | 弱：需穷尽检索证明"首个"，个人实践不可穷尽 | 高：AverNet（蚂蚁，2026-08 开源，"like an organization"定位）等大型项目随时可构成反例 | ❌ 不推荐 |
| **L2** | 组合主张（带限定） | "据检索（2026-11），**跨机异构 agent 实例 + 共享上下文数据库为核心协作底座 + 版本化治理手册 + 交付完整性协议 + turn-driven 值守节律 + 真实运行证据**——该组合未发现完整同构的公开方案" | "To the best of our search (Nov 2026), we found no public scheme that combines all of: heterogeneous agent instances across machines, a shared context database as the sole collaboration substrate, a versioned governance handbook, a delivery-integrity protocol, and a turn-driven on-duty cadence, backed by real-world operation records." | 中高：49 项对标矩阵支撑；每个要素均有近邻但组合空缺成立 | 中：检索盲区（语言、付费墙、私有实践、AverNet 细节未核实）；靠"据检索+未发现完整同构"措辞兜底 | ✅ **推荐（对外"新颖性"表述口径）** |
| **L3** | 贡献主张（不断言唯一性） | "提出并开源一套多机 agent 联邦协作实践方法：room 文件协议、版本化治理手册、交付完整性协议、turn-driven 值守节律，并附 11 天 5 机真实运行记录" | "We document and open-source a working method for federating agent instances across machines — a room file protocol, a versioned governance handbook, a delivery-integrity protocol, and a turn-driven on-duty cadence — with 11 days of real multi-machine operation records." | 高：开源物+运行记录本身即可验证 | 低 | ✅ **推荐（README 贡献段口径，中英并用）** |
| **L4** | 最保守 | "本文档化一个真实运行的 5 机异构 agent 协作案例，提供可复用模板与治理手册样例；不主张新颖性，主张可复用性与透明度" | "A documented, real-world case of coordinating five heterogeneous machines of agents, shared as reusable templates; we claim reusability and transparency, not novelty." | 最高（无需新颖性论证） | 最低，但削弱项目辨识度 | 备用（审慎场合/被质疑后降档口径） |

## 候选主张句逐要素评估（任务书原句）

原句："据检索（2026-11），跨机异构 agent 实例+共享上下文数据库为唯一协作底座+版本化治理手册+交付完整性协议+turn-driven 值守节律+真实运行证据，该组合未发现完整同构的公开方案"

| # | 要素 | 公开最强近邻 | 独有性 | 判定 |
|---|---|---|---|---|
| 1 | 跨机异构 agent 实例 | AverNet、IoA、AgentScope（RPC 分布式）、A2A/ANP | ❌ 要素本身不独有 | 成立但无独占性 |
| 2 | 共享上下文数据库为唯一协作底座 | Letta 共享记忆块、mcp-agent-mail 共享收件箱、claude-swarm 类共享文件、arXiv 2610.16120"substrate-centric"理念 | ◐ 近邻均为"组件"或"单机"；作为多机联邦唯一底座+room 协议的组合未见同构 | 成立 |
| 3 | 版本化治理手册 | microsoft/agent-governance-toolkit（策略工具）、学术制度设计论文 | ◐ "版本化+主编+ack+催办+事故驱动演化"的运行手册未见公开同构 | 成立 |
| 4 | 交付完整性协议 | 全部 49 项对标中无 sha256+字节+通道纪律对应 | ✅ 本轮检索最空维度 | 成立（最强要素） |
| 5 | turn-driven 值守节律 | ai-night-shift（夜间批次）、covey 调度 spec、业界"AI on-call"讨论 | ◐ "会话非守护进程、靠定时提醒唤醒+错峰轮值"未见公开同构 | 成立 |
| 6 | 真实运行证据 | 官方产品文档、Project Sid 论文 | ◐ 个人多机联邦 11 天连续运行+事故记录少见 | 成立 |

**总判定：该句成立度为中高（L2），可对外使用，但需两处措辞修正：**

1. "为唯一协作底座"易被误读为新颖性断言——实际它是**对本项目内部架构的描述**。建议改为"以共享上下文数据库为（本方案内）唯一协作底座"，或在英文版用 "as the sole collaboration substrate (in this design)"。
2. 保留"未发现完整同构的公开方案"这一比较级措辞；任何场景都不得升格为"唯一/首个"。

## 最大反例风险清单（引用时心中要有数）

| 风险源 | 为什么危险 | 当前差距 | 预案 |
|---|---|---|---|
| AverNet（蚂蚁 inclusionAI，2026-08 开源） | 官方描述即"分布式 agent 协调平台……like an organization"，大厂背书+组织隐喻重合；2026-09 已有 DSH channel 插件 | 2026-11-02 已读 README 复核：平台基础设施（identity/auth/路由/容器），治理=权限/审计组件而非版本化手册，无交付指针协议与值守节律，底座是协调网络——**判定非同构** | 已更新矩阵第 23 行；对外强调"零基础设施方法框架 vs 平台基础设施；共享上下文数据库 vs 协调网络"定位差异 |
| ruflo（原 claude-flow，⭐80k） | 蜂群拓扑+记忆库+行为治理，生态最大 | 主打单机 swarm，无跨机联邦/手册治理/交付协议/值守节律 | 强调维度 ①⑥⑦ 差异 |
| Claude Code Agent Teams（官方） | 与 DSH Agent Teams 同构度最高的官方功能 | 单机会话编排，无跨机/治理/值守 | 定位为"互补：单机团队 → 跨机联邦"，两者在 README 中并列 |
| Letta + mcp-agent-mail + 定时脚本（组合拼装） | 理论上可拼出近似系统 | 拼装≠有公开同构方案；且缺手册治理与交付纪律 | 属"可能性反例"而非"存在性反例"，L2 措辞已覆盖 |

## 推荐：对外口径（最终建议）

- **中文（README 新颖性/定位段，L2 修订版）**：
  > 据检索（2026-11），"跨机异构 agent 实例 + 以共享上下文数据库为本方案唯一协作底座 + 版本化治理手册 + 交付完整性协议 + turn-driven 值守节律 + 真实运行证据"这一组合，未发现完整同构的公开方案。各单项均有成熟近邻（见对标矩阵），本项目的贡献在于组合、协议与真实运行记录。
- **英文（README 摘要，L3）**：
  > murmuration documents and open-sources a working method for federating agent instances across heterogeneous personal machines — a room file protocol over a shared context database, a versioned governance handbook, a delivery-integrity protocol, and a turn-driven on-duty cadence — validated by 11 days of real multi-machine operation. It complements single-machine agent-team features (e.g., harness built-ins) rather than replacing them.
- **被质疑时降档口径（L4）**：直接退到"我们不主张首创，主张可复用；对标矩阵公开接受修正（issue/PR 欢迎）"。
- **维护要求**：README 附矩阵链接；每次有人提交新反例，先更新矩阵再决定是否降档；每季度复查 AverNet/ruflo/Claude Code 动向。
