# dsh-federation

> **跨机 DSH 多智能体联邦协作方法框架**
> Federated collaboration for multiple DeepSeek Harness (DSH) agent instances —
> built entirely on a shared context database, with a room protocol, role system,
> versioned governance handbook, delivery discipline, and watch cadence.

**English abstract** — Each machine runs its own AI agent instance, and none of them can (or should) open ports to each other. dsh-federation organizes such instances into a persistent, long-running team using only a shared context database (e.g. [OpenViking](https://docs.openviking.ai/)) as the collaboration substrate: an append-only "room" for messaging (public channel + per-machine inbox + per-role cursors), a role system with per-machine diplomats (一机多岗), a versioned operations handbook whose red lines are evolved from real incidents, a delivery protocol with sha256 integrity pointers, and a schedule-driven watch cadence designed for turn-based agents. This repository publishes the method as reusable specs, templates, a reference tool, and a sanitized 11-day / 5-machine case study. As of our search (2026-11), every individual mechanism has prior art; we did not find a public scheme isomorphic to this particular combination (see `docs/research/`).

## 解决什么问题

一个人（或小团队）在多台机器上各跑一个 agent 实例：Windows 工作站、云端服务器、局域网服务器、宿舍机、甚至无外网机。它们：

- 互相不知道对方在干什么，全靠人肉转达；
- 会话即焚，组织的经验与教训无处沉淀；
- 跨机直接操作（开端口、远程执行）风险高、难审计。

## 核心思路：不改 agent，改组织方式

用五件事把独立实例组成"联邦"：

1. **共享上下文数据库作为唯一协作底座**（本方案的架构选择）—— 所有机器通过 ssh 隧道访问同一个云端共享库（OpenViking），彼此零端口开放。消息、记忆、手册、任务都在库里，天然持久化与可审计。
2. **房间协议**（[spec/room-protocol.md](spec/room-protocol.md)）—— append-only 消息：`general.md` 公共频道 + `inbox/<机器>.md` 收件箱 + `cursor/<机器>-<岗位>.md` 游标；消息 id 带机器-岗位-时间戳；大附件以"路径+sha256+字节数"指针替代。
3. **岗位体系**（[docs/02-roles.md](docs/02-roles.md)）—— 外交官（统一对外发声）、机械师（运维）、主编（手册治理）、协调员等；一机可多岗，游标分账。
4. **版本化治理手册**（[docs/03-governance.md](docs/03-governance.md)）—— 四卷手册（总则红线/跨机经验/事故档案/协作分发），主编制度、ack 追踪、每周汇总；红线条目全部由真实事故反推而来。
5. **交付协议与值守节律**（[spec/handoff-manifest.md](spec/handoff-manifest.md)、[docs/04-watchkeeping.md](docs/04-watchkeeping.md)）—— 文件交付只走既有通道、通知只给指针；turn-driven 会话靠 schedule 定时提醒按节律"值班"。

## 仓库结构

```
dsh-federation/
├── README.md / README.en.md     你在这里
├── spec/                        房间协议、交付协议（机器可依循的规范）
├── docs/                        架构 / 岗位 / 治理 / 值守 / 接入 / 教训
│   └── research/                新颖性评估：对标矩阵、主张阶梯、反方审查、检索日志
├── templates/                   AGENTS.md / HANDBOOK.md / 房间初始化 / 红线清单模板
├── reference/                   handbook.mjs 参考工具（生产环境在用）
├── case-study/                  11 天 / 5 台机器的脱敏运行案例
└── tools/                       Phase A 插件路线图（dsh 插件：跨机联邦客户端）
```

## 快速开始（30 分钟接入一台机器）

1. 装 DSH 并建工作区；装 Node.js ≥18（跑参考工具）。
2. 连通共享上下文数据库（云端部署 OpenViking，本机隧道接入）。
3. 抄 `templates/AGENTS.template.md` 到用户级 AGENTS.md（注入"开工先查手册、收工写回"的规矩）。
4. 按 `templates/room-init.md` 建房（或加入已有房），发第一条自介消息（身份四坐标）。
5. 认领岗位、建游标、开始第一单任务。

完整清单见 [docs/05-onboarding.md](docs/05-onboarding.md)。

## 案例摘要（脱敏）

2026-10-22 至 11-02，5 台异构机器（Windows 工作站 / 云端服务器 / 局域网服务器 / 宿舍机 / 无外网机）按本方法组成联邦：协议 10 天演化 4 个小版本；8 类岗位、一机多岗普遍；四卷共享手册迭代至 v2.1.2，45 条跨机经验、13 起归档事故；值守从"有事才看"制度化为白天每小时/夜间每 2 小时；期间完成多笔上千文件级交付（逐文件 sha256 校验）。详见 [case-study/timeline.md](case-study/timeline.md)。

## 与单机团队机制和平台方案的关系

- **DSH 内置 Agent Teams / Claude Code Agent Teams / ruflo（原 claude-flow）**：互补而非替代。这些解决**单机**多 agent 协作（共享进程、cwd 与任务板；ruflo 主打单机蜂群+记忆树）；本框架解决**跨机**联邦——独立实例、异构环境、跨网络，以共享上下文数据库为唯一纽带。两者可以叠用（单机内部用 Teams，机间用联邦）。
- **AverNet（蚂蚁 inclusionAI）**：检索范围内定位最近的平台级方案——组织规模的持久多 agent 基础设施（身份/鉴权/发现/路由/容器，2026-09 起亦提供 DeepSeek Harness channel 插件）。差异：AverNet 是**平台基础设施**（底座为协调网络），本仓库是**零基础设施的方法框架**（底座为一个普通共享上下文数据库，附手册治理、交付纪律与值守节律）。需要平台能力选 AverNet；想要轻量个人/小团队联邦可直接照本仓库方法落地。

## 新颖性口径

据检索（2026-11）：多智能体协作框架、邮箱/黑板机制、通信协议、治理工具包等**单点机制均有先例**，最近邻为 AverNet（平台路线）、ruflo（单机蜂群）、各家单机 Agent Teams（对标矩阵见 [docs/research/novelty-matrix.md](docs/research/novelty-matrix.md)，49 系统 × 10 维）；"跨机异构实例 + 以共享上下文数据库为协作底座（方案内架构）+ 版本化治理手册 + 交付完整性协议 + turn-driven 值守节律 + 真实运行证据"这一**组合**未发现完整同构的公开方案。我们不使用"首创/第一"表述；如你发现反例，欢迎提 issue（主张阶梯与降档预案见 [docs/research/claim-ladder.md](docs/research/claim-ladder.md)）。

## 路线图

- **v0.1（当前）**：方法框架（spec/docs/templates）+ 参考工具 + 脱敏案例
- **v0.2（计划）**：DSH 插件（fed_room_scan / fed_room_post / fed_cursor / fed_handoff_verify / fed_ack_board）→ [tools/PLUGIN-ROADMAP.md](tools/PLUGIN-ROADMAP.md)
- **v0.3+**：英文全量文档、更多环境的接入记录、协议 v2（服务端去重与权限隔离探索）

## 许可与声明

- 代码（含 `reference/`）：MIT；文档：CC BY 4.0（见 [NOTICE.md](NOTICE.md)）。
- 本项目为社区项目，与 DeepSeek（deepseek-harness）、OpenViking 项目无隶属关系。
- 案例中机器均为化名，已按脱敏规则处理；作者：tlf。
