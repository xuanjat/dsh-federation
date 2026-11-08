# murmuration 新颖性对标矩阵（novelty-matrix）

- 检索窗口：2026-11-02（北京时间）；检索方式：web_search + web_fetch + GitHub API；详见同目录 [search-log.md](search-log.md)。
- 图例：✅ 完整具备 ｜ ◐ 部分/近似/可扩展实现 ｜ ❌ 未具备 ｜ ⚠️ 未核实（本轮检索未能确认）。
- 立场声明：本矩阵为 murmuration 对外新颖性主张的依据底稿，假定全世界会读到；所有"未发现"类结论均受检索窗口与语言覆盖（以中英文为主）限制。
- 十个维度：①跨机/跨网络拓扑 ②协作底座（共享内存/消息总线/文件/平台）③长期性（常设组织 vs 单任务）④角色体系（含一机多岗？）⑤治理机制（手册/红线/事故驱动？）⑥交付完整性协议（sha256/通道纪律？）⑦值守/唤醒模式（turn-driven 值守？）⑧人在环（HITL 边界）⑨隐私边界纪律 ⑩真实运行证据（时长/规模）。

## 参考行：murmuration（本项目实践）

| 系统 | ① | ② | ③ | ④ | ⑤ | ⑥ | ⑦ | ⑧ | ⑨ | ⑩ |
|---|---|---|---|---|---|---|---|---|---|---|
| **murmuration（5 机实践）** | ✅ 5 台异构机（Windows 工作站/云端服务器/局域网服务器/宿舍机/无外网机），互不开端口，经 ssh 隧道连共享上下文数据库 | ◐ 共享上下文数据库（OpenViking）为**唯一**协作底座 + room/ 文件协议（general.md + inbox/ + cursor/，append-only，mid 规范，>2KB 走 data 指针） | ✅ 常设组织（2026-10-22 建房起持续运行，跨任务存续） | ✅ 岗位制（diplomat/mechanic/editor/coordinator/research/ops）+ **一机多岗** | ✅ 版本化共享手册库 v1→v2.1.2（卷0 总则红线 R-01..R-15 / 卷1 经验 / 卷2 运维事故 / 卷3 协作分发）+ 主编制度 + ack 追踪 + 48h 催办 + 事故驱动红线演化 | ✅ R-15 交付协议：外交官统一外发、sha256+字节数、文件走既有通道、通知只给指针 | ✅ turn-driven 值守：DSH 会话非守护进程，靠 schedule 定时提醒唤醒（白天 1h/夜间 2h，分钟错峰） | ◐ 人在决策点拍板 + 红线授权边界（哪些事 agent 不得自行决定） | ◐ 隐私红线：个人敏感文件禁入共享库、二进制不入文本区 | ✅ 11 天真实运行、5 机、多起真实事故与恢复记录（手册库事故卷 I-001..I-013） |

## A. 单机多智能体编排框架（15）

| # | 系统 | ① | ② | ③ | ④ | ⑤ | ⑥ | ⑦ | ⑧ | ⑨ | ⑩ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | AutoGen / AG2 | ◐ 进程内为主，v0.4 actor 运行时理论上可分布 | 消息传递（actor） | ❌ 单任务 | ◐ 角色由代码定义 | ❌ | ❌ | ❌ | ◐ human proxy | ❌ | ◐ 社区规模即证据 |
| 2 | CrewAI | ❌ | 进程内编排 | ❌ | ✅ crew/角色 | ❌ | ❌ | ❌ | ◐ | ❌ | ◐ |
| 3 | LangGraph | ◐ 可部署为服务 | 共享状态图 + checkpointer | ◐ 持久化检查点 | ◐ supervisor 模式 | ❌ | ❌ | ◐ 可外接定时 | ◐ interrupt | ❌ | ◐ |
| 4 | MetaGPT | ❌ | 消息/文档流 | ❌ | ✅ SOP 角色（PM/架构/工程） | ◐ SOP 制度化（非运行手册） | ❌ | ❌ | ❌ | ❌ | ◐ |
| 5 | ChatDev | ❌ | chat chain | ❌ | ✅ 软件公司角色 | ◐ | ❌ | ❌ | ❌ | ❌ | ◐ |
| 6 | CAMEL | ❌ | 角色扮演对话 | ❌ | ◐ | ❌ | ❌ | ❌ | ❌ | ❌ | ◐ |
| 7 | AgentVerse | ❌ | 仿真环境 | ❌ | ◐ | ❌ | ❌ | ❌ | ◐ | ❌ | ◐ |
| 8 | Magentic-One / Magentic 编排 | ❌ | orchestrator 消息 | ❌ | ✅ 专才 agent（浏览/文件/代码/终端） | ❌ | ❌ | ❌ | ◐ | ❌ | ✅ 微软官方 |
| 9 | OpenAI Swarm（→Agents SDK） | ❌ | 进程内 handoff | ❌ | ◐ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ 官方教育框架 |
| 10 | XAgent | ❌ | 双层 agent | ❌ | ◐ | ❌ | ❌ | ❌ | ◐ | ❌ | ◐ |
| 11 | agentUniverse（蚂蚁） | ❌ | PMEMA 协作 | ❌ | ✅ 角色/团队 | ❌ | ❌ | ❌ | ◐ | ❌ | ◐ |
| 12 | Coze Studio（开源版） | ◐ 单实例自托管 | 平台（编排+知识库+变量） | ◐ 长期会话 | ◐ | ❌ | ❌ | ❌ | ◐ | ◐ 平台侧 | ✅ 大规模生产 |
| 13 | OpenHands | ◐ 沙箱运行时可分布 | 平台 | ❌ | ◐ | ❌ | ❌ | ❌ | ◐ | ❌ | ✅ |
| 14 | AutoGPT Platform | ◐ 云/自托管 | blocks 编排 | ◐ | ◐ | ❌ | ❌ | ◐ | ❌ | ❌ | ✅ |
| 15 | SuperAGI | ◐ | 平台+资源管理 | ◐ | ◐ | ❌ | ❌ | ❌ | ◐ | ❌ | ◐ ⚠️ 本轮未逐项核验 |

一句话结论与出处：
1. AG2（原 AutoGen）"The Open-Source AgentOS"，单机编排为主 — https://github.com/ag2ai/ag2 （⭐5,040）；原仓库 https://github.com/microsoft/autogen
2. CrewAI 角色化 crew 编排，进程内 — https://github.com/crewAIInc/crewAI （⭐60,420）
3. LangGraph 图编排+检查点持久化 — https://github.com/langchain-ai/langgraph （⭐44,334）
4. MetaGPT "First AI Software Company" SOP 角色流水线 — https://github.com/FoundationAgents/MetaGPT （⭐71,135）
5. ChatDev 对话式软件开发 — https://github.com/OpenBMB/ChatDev （⭐34,642）；ACL 2024 论文 https://aclanthology.org/2024.acl-long.810/
6. CAMEL 角色扮演智能体社会 — https://github.com/camel-ai/camel （⭐18,007）
7. AgentVerse 多 agent 仿真部署 — https://github.com/OpenBMB/AgentVerse （⭐5,167）
8. Magentic-One 已并入微软 Agent Framework 的 Magentic 编排（orchestrator+专才 agent） — https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/magentic
9. OpenAI Swarm 轻量 handoff（教学性质，Successors 为 Agents SDK） — https://github.com/openai/swarm （⭐22,094）
10. XAgent 自主任务求解 — https://github.com/OpenBMB/XAgent
11. agentUniverse 蚂蚁开源多智能体框架（PMEMA） — https://github.com/agentuniverse-ai/agentuniverse （PyPI 作者 AntGroup）
12. Coze Studio 字节开源 agent 开发平台 — https://github.com/coze-dev/coze-studio （⭐21,793）；官方公告 https://www.byteplus.com/zh-CN/blog/coze-open-sources-ai-agent-tools
13. OpenHands AI 软件工程平台 — https://github.com/OpenHands/OpenHands （⭐92,493）
14. AutoGPT 平台化（agents+blocks） — https://github.com/Significant-Gravitas/AutoGPT
15. SuperAGI 自治 agent 平台 — https://github.com/TransformerOptimus/SuperAGI ⚠️（本轮仅确认存在，未逐项核验）

## B. 跨机/网络化协作与协议（12）

| # | 系统 | ① | ② | ③ | ④ | ⑤ | ⑥ | ⑦ | ⑧ | ⑨ | ⑩ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 16 | A2A 协议 | ✅ 跨网络 HTTP RPC | 协议（AgentCard/任务） | ❌ 按任务会话 | ❌ | ❌ | ❌ | ❌ | ◐ 鉴权 | ✅ 基金会多厂商 |
| 17 | MCP | ◐ 客户端-服务器可跨机 | 工具/上下文协议 | ❌ | ❌ | ❌ | ❌ | ❌ | ◐ | ✅ 业界事实标准 |
| 18 | ANP | ✅ WAN 跨主体互联 | DID（did:wba）+协议协商 | ◐ 愿景为常设智能体网络 | ❌ | ❌ | ❌ | ❌ | ◐ DID 身份 | ◐ 社区阶段 |
| 19 | Agora | ⚠️ | ⚠️ 互操作试验 | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| 20 | BeeAI | ◐ 本地网络多框架互操作（A2A） | 平台/框架 | ❌ | ❌ | ❌ | ❌ | ❌ | ◐ | ◐ |
| 21 | AgentScope | ✅ RPC 分布式部署 | 消息传递 + msghub | ❌ | ◐ | ❌ | ❌ | ❌ | ◐ | ❌ | ✅ 论文+大规模仿真 |
| 22 | IoA | ✅ 异构 agent 互联网式组网 | 客户端-服务器消息 | ❌ 按任务 | ◐ | ❌ | ❌ | ❌ | ❌ | ❌ | ◐ 论文级 |
| 23 | AverNet（蚂蚁 inclusionAI） | ✅ 分布式协调平台（发现/关系/组队/路由） | 协调网络 + 容器/集群（自托管平台） | ✅ 常驻组织（蚂蚁 12 BG 生产） | ◐ 组队/关系，未见一机多岗分账 | ◐ identity/权限/审计为**组件**（Permissions=Partial、Security=Planned、Audit=In progress），未见版本化运行手册/事故驱动红线 | ❌ 未见 sha256 指针/通道纪律对应物 | ◐ 常驻服务架构，非 turn-driven 值守 | ◐ 人机协作 Web UI | ◐ 权限/安全部分 Planned | ✅ 蚂蚁 12 BG 生产（自述 90%+ 完成率） |
| 24 | AgentOS | ◐ HTTP 进程管理可跨机 | 进程/HTTP | ◐ 长驻守护 | ❌ | ❌ | ◐ 生命周期调度 | ❌ | ❌ | ◐ |
| 25 | OpenMOSS | ⚠️ "自组织多智能体协作" | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ◐ ⚠️ |
| 26 | OACP | ◐ 声称任意运行时 | YAML 文件协议（无服务器） | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ HITL 为核心卖点 | ❌ | ◐ 早期（⭐15） |
| 27 | mcp-agent-mail | ◐ 单机为主 | 共享收件箱（SQLite） | ◐ 邮箱持续存在 | ❌ | ❌ | ❌ | ◐ 轮询 | ◐ | ❌ | ◐ |

一句话结论与出处：
16. A2A（Agent2Agent，Linux 基金会）agent 间任务协议 — https://github.com/a2aproject/a2a
17. MCP（Model Context Protocol）模型-工具-上下文协议 — https://modelcontextprotocol.io ；公告 https://www.anthropic.com/news/model-context-protocol
18. ANP 开源智能体网络协议（did:wba 去中心化身份，跨主体跨网络） — https://github.com/agent-network-protocol/AgentNetworkProtocol （⭐1,463）；官网 https://agent-network-protocol.com ；did:wba 规范见仓库 03-did-wba-method-design-specification.md；W3C Agent Protocol CG 相关追踪 https://lists.w3.org/Archives/Public/public-agentprotocol/2026Sep/att-0009/AdoptionTracker.pdf
19. Agora ⚠️ PyPI 存在同名包（agora-protocol），项目定位与活跃度未核实 — https://pypi.org/project/agora-protocol/
20. BeeAI 多框架 agent 互操作框架（IBM Bee 生态） — https://github.com/i-am-bee/beeai-framework
21. AgentScope 阿里开源，官方文档含分布式（RPC）教程 — https://github.com/agentscope-ai/agentscope （⭐35,208）；分布式教程 https://github.com/agentscope-ai/agentscope/blob/main/docs/sphinx_doc/zh_CN/source/tutorial/208-distribute.md ；论文 ACL 2025 Industry https://aclanthology.org/2025.acl-industry.94/
22. IoA "Internet of Agents"异构分布式 agent 组队协作 — https://github.com/OpenBMB/IoA （⭐838）；论文 https://arxiv.org/abs/2407.07061
23. AverNet 蚂蚁 inclusionAI 开源"分布式 agent 协调平台，agents live/connect/coordinate/execute/evolve together — like an organization"（本矩阵最接近的大型竞品；2026-11-02 已读其 README 核验：平台基础设施路线——identity/auth/发现/路由/容器编排，蚂蚁 12 BG 生产；**未见**版本化治理手册、sha256 交付指针协议、turn-driven 值守节律；底座是协调网络而非共享上下文数据库；另其 2026-09 已提供 DeepSeek Harness channel 插件，DSH bots 以 manager-worker 加入） — https://github.com/inclusionAI/Avernet ；媒体报道 https://www.zhiding.cn/ai/2026/0807/3195607.shtml
24. AgentOS 长驻 agent 进程管理（HTTP 调用/生命周期调度） — https://agentos.to ；文档 https://agentos-ai.dev/docs/invoke （GitHub 仓库 ⚠️ 未核实）
25. OpenMOSS 自组织多智能体协作框架 — https://github.com/uluckyXH/OpenMOSS ⚠️（描述仅来自搜索结果标题，README 获取失败）
26. OACP "Coordinate AI agents with human-in-the-loop control — YAML-based protocol, no server, any runtime" — https://github.com/kiloloop/oacp （⭐15）；协议文档 https://github.com/kiloloop/oacp/blob/main/docs/protocol/inbox_outbox.md ；官网 https://oacp.dev
27. mcp-agent-mail 给 agent 配 SMTP 式收件箱做异步消息（SQLite） — https://github.com/Dicklesworthstone/mcp_agent_mail （PyPI 镜像 https://pypi.org/project/mcp-agent-mail/ ）

## C. Claude / DSH 生态多代理工具（10）

| # | 系统 | ① | ② | ③ | ④ | ⑤ | ⑥ | ⑦ | ⑧ | ⑨ | ⑩ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 28 | claude-flow（ruvnet，现 ruflo） | ◐ 主打本机 swarm | 内存库（SQLite/Neo4j）+MCP | ◐ 会话可续 | ✅ queen/worker 蜂群拓扑 | ◐ 行为治理/协议 | ❌ | ◐ | ◐ | ❌ | ✅ ⭐80k 社区 |
| 29 | claude-swarm（cj-vana） | ❌ tmux 单机 | MCP/tmux + 协议 | ❌ | ✅ worker 蜂群 | ◐ "protocol-based behavioral governance" | ❌ | ❌ | ◐ | ❌ | ◐ ⭐117 |
| 30 | The Hive（tt-a1i/hive） | ❌ 浏览器单机 | 浏览器 UI 编排 | ❌ | ✅ hive-mind | ❌ | ❌ | ❌ | ◐ | ❌ | ◐ ⭐582 |
| 31 | Claude Code Agent Teams（官方） | ❌ 同机多会话 | 共享文件/任务板 | ◐ 会话组存续 | ✅ lead/teammate | ❌ | ❌ | ❌ | ◐ | ❌ | ✅ 官方文档 |
| 32 | Claude Code subagents | ❌ | 进程内隔离上下文 | ❌ | ◐ | ❌ | ❌ | ❌ | ◐ | ❌ | ✅ 官方 |
| 33 | DSH Agent Teams（deepseek-harness 内置） | ❌ 单机 lead+teammates | 共享文件系统+共享任务板 | ◐ 会话组存续 | ✅ lead/teammate 岗位 | ❌ | ❌ | ◐ 具备 schedule 提醒能力但非值守节律默认 | ◐ | ❌ | ✅ 官方（本实践所用底座） |
| 34 | claude-squad | ❌ | tmux+git worktrees | ❌ | ◐ | ❌ | ❌ | ❌ | ◐ | ❌ | ◐ |
| 35 | vibe-kanban | ◐ 本机服务器多 agent | 看板+工作区 | ◐ | ◐ 看板分派 | ❌ | ❌ | ◐ | ◐ | ❌ | ◐ |
| 36 | OpenClaw | ◐ 单机常驻、多渠道接入 | 网关守护进程 | ✅ 个人助理常驻 | ◐ 多 agent ⚠️ | ❌ | ❌ | ◐ 常驻监听（非 turn-driven 值守） | ◐ | ◐ | ✅ ⭐394k |
| 37 | ai-night-shift | ⚠️ | ⚠️ 多 agent 框架 | ◐ 夜间自动运行 | ⚠️ | ❌ | ❌ | ◐ "while you sleep"夜间批次 | ◐ | ❌ | ◐ |

一句话结论与出处：
28. claude-flow（已演进为 ruvnet/ruflo，"The original agent harness. Deploy intelligent multi-player swarms"） — https://github.com/ruvnet/ruflo （⭐80,597，claude-flow 为其前身品牌）；swarm 拓扑包 https://github.com/ruvnet/ruflo/tree/v3.10.25/v3/%40claude-flow/swarm
29. cj-vana/claude-swarm："MCP server for orchestrating parallel Claude Code worker swarms with protocol-based behavioral governance"（tmux） — https://github.com/cj-vana/claude-swarm （⭐117）
30. The Hive：任务书所指 "munder-difflin/the-hive" 仓库**未找到**（⚠️未核实）；最接近的同名项目为 tt-a1i/hive "Browser-native hive-mind for CLI coding agents" — https://github.com/tt-a1i/hive （⭐582）；另有 sreekar2403/hive 等
31. Claude Code 官方 Agent Teams：编排多个 Claude Code 会话成团队（同机） — https://code.claude.com/docs/en/agent-teams
32. Claude Code subagents（单机子代理，隔离上下文） — https://code.claude.com/docs/en/best-practices ⚠️（sub-agents 专页 URL 未直接核验）
33. DeepSeek Harness 内置 Agent Teams（本实践所用单机团队机制，与 murmuration 的跨机联邦互补） — 官方页 https://www.deepseek.com/en/harness/ ；社区镜像 https://github.com/batata-wqx/deepseek-harness ⚠️（官方开源仓库地址未核实）
34. claude-squad 用 tmux/worktrees 并行管理多个 CLI coding agent — https://github.com/smtg-ai/claude-squad
35. vibe-kanban 看板驱动多个 coding agent — https://github.com/BloopAI/vibe-kanban
36. OpenClaw（原 Clawdbot/molt）个人 AI 助理常驻网关，"Any OS. Any Platform." — https://github.com/openclaw/openclaw （⭐393,706）
37. ai-night-shift "let your AI work while you sleep 🌙"多 agent 夜间自主框架 — https://github.com/JudyaiLab/ai-night-shift ⚠️（细节未核验）

## D. 记忆 / 共享上下文系统（3）

| # | 系统 | ① | ② | ③ | ④ | ⑤ | ⑥ | ⑦ | ⑧ | ⑨ | ⑩ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 38 | Letta（MemGPT） | ◐ 服务化 | 共享 memory blocks | ✅ 长期记忆 | ❌ | ❌ | ❌ | ❌ | ◐ | ❌ | ✅ |
| 39 | Mem0 | ◐ 服务化 | 记忆层 API | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ◐ | ✅ |
| 40 | Zep | ◐ 服务化 | 时序知识图谱 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ◐ | ✅ |

一句话结论与出处：
38. Letta 有状态 agent 平台，官方支持多 agent 共享 memory blocks — https://github.com/letta-ai/letta （⭐25,320）；共享记忆文档 https://docs.letta.com/v1-sdk/memory/shared-memory
39. Mem0 通用 agent 记忆层 — https://github.com/mem0ai/mem0
40. Zep 长期记忆（时序知识图谱） — https://github.com/getzep/zep （⭐4,985）

## E. 仿真社会 / 学术（5）

| # | 系统 | ① | ② | ③ | ④ | ⑤ | ⑥ | ⑦ | ⑧ | ⑨ | ⑩ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 41 | Generative Agents（斯坦福小镇） | ❌ | 共享世界状态+记忆流 | ✅ 模拟社会常设 | ◐ | ◐ 涌生社会规范（非治理手册） | ❌ | ❌ | ❌ | ❌ | ✅ 论文+开源 |
| 42 | AI-town | ❌ | 共享世界状态 | ✅ | ◐ | ❌ | ❌ | ❌ | ❌ | ❌ | ◐ |
| 43 | Project Sid（Altera） | ◐ 分布式引擎 | 共享世界+对话 | ✅ 千 agent 文明 | ◐ 分化角色 | ◐ 涌现治理（宗教/法律） | ❌ | ❌ | ❌ | ❌ | ✅ 论文实证 |
| 44 | A Society of Researchers | ◐ 设计主张 | 制度设计 | ✅ 主张群体需显式组织 | ◐ | ✅ 论文级制度设计 | ❌ | ❌ | ◐ | ❌ | ◐ 论文 |
| 45 | Substrate-Centric Coordination | ◐ | "协调基底"中心化 | ❌ | ❌ | ◐ | ❌ | ❌ | ❌ | ❌ | ◐ 论文 |

一句话结论与出处：
41. Generative Agents 小镇模拟 — https://github.com/joonspk-research/generative_agents （⭐22,328）
42. AI-town 可自建 agent 小镇 — https://github.com/a16z-infra/ai-town
43. Project Sid 千级 agent 文明模拟 — https://arxiv.org/abs/2411.00114
44. "A Society of Researchers: Designing Institutions for Populations of Autonomous Research Agents"（主张 agent 种群应显式设计组织制度） — https://arxiv.org/abs/2610.10468
45. "Scaling Multi-Agent Intelligence with Substrate-Centric Coordination"（主张以协调基底而非 agent 为中心扩展 MAS） — https://arxiv.org/abs/2610.16120

## F. 治理工具（2）

| # | 系统 | ① | ② | ③ | ④ | ⑤ | ⑥ | ⑦ | ⑧ | ⑨ | ⑩ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 46 | microsoft/agent-governance-toolkit | ❌ 工具箱 | 策略执行/沙箱 | ❌ | ❌ | ✅ 组织级治理（策略/零信任/合规） | ◐ 审计链路 | ❌ | ✅ 审批流 | ✅ 合规边界 | ✅ 微软官方 |
| 47 | agentic-ai-governance-toolkit | ❌ | 治理工件集（生命周期/风险评分/EU AI Act） | ❌ | ❌ | ✅ 治理工件 | ❌ | ❌ | ◐ | ✅ | ◐ ⭐1 |

一句话结论与出处：
46. 微软 AI Agent Governance Toolkit（policy enforcement, zero-trust identity, execution sandboxing） — https://github.com/microsoft/agent-governance-toolkit （⭐6,506）
47. 受监管组织的 agent 治理工件集 — https://github.com/leonkoellerwirth-arch/agentic-ai-governance-toolkit （⭐1）

## G. 其他（2）

| # | 系统 | ① | ② | ③ | ④ | ⑤ | ⑥ | ⑦ | ⑧ | ⑨ | ⑩ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 48 | Ormica | ⚠️ | 协调层（"自组织 agent 殖民地"） | ◐ | ◐ | ❌ | ❌ | ❌ | ◐ | ❌ | ◐ PyPI 阶段 |
| 49 | agt-team | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |

一句话结论与出处：
48. Ormica "open-source Python framework for building self-organizing colonies of agents" — https://pypi.org/project/ormica/
49. agt-team — https://pypi.org/project/agt-team/ ⚠️（仅确认包存在，定位未核实）

## 分维度小结（最接近的公开近邻）

| 维度 | 公开近邻（最强者在前） | murmuration 是否独有 |
|---|---|---|
| ①跨机拓扑 | AverNet / IoA / AgentScope / ANP / A2A | ❌ 不独有（但"个人异构机器联邦+互不开端口+含离线机"具体形态少见） |
| ②协作底座 | Letta 共享记忆块、mcp-agent-mail 共享收件箱、claude-swarm 类共享文件 | ◐ "共享上下文数据库为唯一底座+room 文件协议"组合仍少见 |
| ③长期性 | OpenClaw（常驻个人助理）、AverNet（组织定位）、Project Sid（模拟文明） | ◐ "常设**多机组织**"少见 |
| ④角色体系 | ruflo/cj-vana swarm（queen/worker）、CC Agent Teams、MetaGPT（SOP 角色） | ◐ "一机多岗+跨机岗位"表述少见 |
| ⑤治理机制 | ms governance toolkit（策略）、AverNet ⚠️、学术制度设计论文 | ◐ "版本化手册+主编+ack+催办+事故驱动演化"未见公开同构 |
| ⑥交付完整性 | 全部对标中未检索到 sha256+字节数+通道纪律的交付协议 | ✅ 本轮检索中最空维度（最接近：治理工具箱的审计链路，目的不同） |
| ⑦值守/唤醒 | ai-night-shift（夜间批次）、covey 生命周期调度 spec、run-kit cron 文档、业界"AI on-call"讨论 | ◐ "turn-driven 会话靠定时提醒值守+错峰轮值"未见公开同构 |
| ⑧人在环 | OACP（HITL 核心卖点）、多数框架的 interrupt/approval | ❌ 不独有 |
| ⑨隐私边界 | ms governance toolkit（合规层） | ◐ "运行时隐私红线（个人文件禁入共享库）作为协作纪律"少见 |
| ⑩真实运行证据 | 官方产品文档、Project Sid 论文 | ◐ "个人多机联邦 11 天连续运行+事故记录"少见 |

## 本矩阵的已知盲区（诚实声明）

1. 检索以中英文为主，未覆盖日韩/俄语社区与付费墙内容（Semantic Scholar 深页、内部实践）。
2. AverNet 为最大潜在反例：其"组织"隐喻与分布式定位最接近。2026-11-02 已补读其 README（经云端服务器走 GitHub API）：确认是**平台基础设施**（identity/auth/发现/路由/容器），治理为权限/审计组件而非版本化手册，无交付指针协议与值守节律方法，底座是协调网络——**判定非同构**，矩阵第 23 行已按核验结果更新。后续仍应关注其演进。
3. "The Hive(munder-difflin)" 按任务书给的名号未找到对应仓库；同名 hive 类项目已列入第 30 行。
4. 社区里大量未打星/私有的个人实践（个人博客、论坛帖）无法穷尽；这正是主张必须限定"据检索（2026-11）"的原因。
